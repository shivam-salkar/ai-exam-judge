import { useState, useEffect } from "react";
import { Editor } from "@monaco-editor/react";
import axios from "axios";
import { auth } from "../src/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../src/firebase";
import useTabSwitchAlert from "../src/components/useTabSwitchAlert";
import QuestionCard from "../src/components/QuestionCard";
import { useNavigate } from "react-router-dom";

function Workspace() {
  const navigate = useNavigate();
  const [value, setValue] = useState("");
  const [outputText, setOutputText] = useState("");
  const [inputText, setInputText] = useState("");
  const [userID, setUserID] = useState("");
  const [userName, setUserName] = useState("");
  const [rollNo, setRollNo] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [showQuestion, setShowQuestion] = useState(false);

  // Submission State
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Exam State
  const [question, setQuestion] = useState(null);
  const [questionLoading, setQuestionLoading] = useState(false);
  const [questionError, setQuestionError] = useState("");
  const [examStarted, setExamStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const EXAM_DURATION = 60 * 60; // 60 minutes in seconds

  const isMobile = window.innerWidth < 768;

  // useTabSwitchAlert();

  const handleOpenQuestion = () => {
    setShowQuestion(true);
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        navigate("/");
        return;
      }

      const uid = firebaseUser.uid;
      setUserID(uid);

      const ref = doc(db, "users", uid);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        const data = snap.data();
        setUserName(data.name);
        setRollNo(data.roll);
        setUserEmail(data.email);
      }

      // 1. Check/Fetch Question
      const storedQuestion = localStorage.getItem(`examQuestion_${uid}`);
      if (storedQuestion) {
        setQuestion(JSON.parse(storedQuestion));
      } else {
        try {
          setQuestionLoading(true);
          setQuestionError("");
          // Add timestamp to prevent browser caching
          const res = await fetch(
            `http://localhost:3001/api/question?t=${Date.now()}`,
            {
              cache: "no-store",
              headers: {
                Pragma: "no-cache",
                "Cache-Control": "no-cache",
              },
            }
          );
          const data = await res.json();
          if (data.error) {
            throw new Error(data.error);
          }
          localStorage.setItem(`examQuestion_${uid}`, JSON.stringify(data));
          setQuestion(data);
        } catch (err) {
          console.error("Failed to fetch question", err);
          setQuestionError("Failed to load question. Please try again.");
        } finally {
          setQuestionLoading(false);
        }
      }

      // 2. Check Timer
      const storedStartTime = localStorage.getItem(`examStartTime_${uid}`);
      if (storedStartTime) {
        const elapsed = Math.floor(
          (Date.now() - parseInt(storedStartTime)) / 1000
        );
        const remaining = EXAM_DURATION - elapsed;
        if (remaining > 0) {
          setExamStarted(true);
          setTimeLeft(remaining);
        } else {
          setExamStarted(true);
          setTimeLeft(0);
        }
      }
    });

    return () => unsub();
  }, [navigate]);

  // Timer Effect
  useEffect(() => {
    if (!examStarted || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [examStarted, timeLeft]);

  const handleLogout = async () => {
    if (userID) {
      console.log("Clearing exam data for user:", userID);
      localStorage.removeItem(`examQuestion_${userID}`);
      localStorage.removeItem(`examStartTime_${userID}`);
    }
    await signOut(auth);
    navigate("/");
  };

  const handleStartExam = () => {
    const now = Date.now();
    localStorage.setItem(`examStartTime_${userID}`, now.toString());
    setExamStarted(true);
    setTimeLeft(EXAM_DURATION);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const runCode = async () => {
    try {
      console.log("INPUT SENT TO PISTON:", JSON.stringify(inputText));
      const res = await axios.post("https://emkc.org/api/v2/piston/execute", {
        language: "c",
        version: "10.2.0",
        files: [
          {
            name: "main.c",
            content: value,
          },
        ],
        stdin: inputText || "",
      });
      const { run } = res.data;
      const combinedOutput = [run?.stdout, run?.stderr]
        .filter((text) => text && text.trim() !== "")
        .join("\n");
      setOutputText(combinedOutput || "Program executed with no output.");
    } catch (error) {
      setOutputText("Error running code. \n " + error);
    }
  };

  const handleSubmit = async () => {
    setShowConfirmModal(false);
    setIsSubmitting(true);
    try {
      const res = await axios.post("http://localhost:3001/api/submit", {
        question,
        code: value,
        output: outputText,
      });
      const evaluation = res.data;
      setEvaluationResult(evaluation);

      // Store in Firestore
      try {
        await addDoc(collection(db, "submissions"), {
          userId: userID,
          userName: userName,
          rollNo: rollNo,
          userEmail: userEmail,
          question: question.question,
          topic: question.topic,
          code: value,
          output: outputText,
          marks: evaluation.marks,
          totalMarks: question.marks || 5,
          review: evaluation.review,
          submittedAt: serverTimestamp(),
        });
        console.log("Submission saved to Firestore");
      } catch (dbError) {
        console.error("Error saving to Firestore:", dbError);
      }

      setShowResultModal(true);
    } catch (error) {
      console.error("Submission failed", error);
      alert("Failed to submit. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isMobile) {
    return (
      <div className="">
        <h1 className="text-2xl">Mobile Not Supported</h1>
        <br />
        <p>Please use a desktop or laptop to access this website.</p>
      </div>
    );
  }

  return (
    <div className="p-5 h-screen flex flex-col">
      <QuestionCard
        open={showQuestion}
        onClose={() => setShowQuestion(false)}
        question={question}
        loading={questionLoading}
        error={questionError}
        examStarted={examStarted}
        onStartExam={handleStartExam}
      />

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-[#161a1f] p-8 rounded-lg border border-gray-300 shadow-2xl max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4 text-white">
              Confirm Submission
            </h2>
            <p className="text-gray-300 mb-6">
              Are you sure you want to submit your code? This will evaluate your
              solution against the question.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="btn btn-outline text-white border-gray-500 hover:bg-gray-700">
                No, Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="btn bg-green-600 hover:bg-green-700 text-white border-none">
                Yes, Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Result Modal */}
      {showResultModal && evaluationResult && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-[#161a1f] p-8 rounded-2xl border border-gray-300 shadow-2xl max-w-2xl w-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-white">
                Evaluation Result
              </h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-xl text-gray-400">Marks:</span>
                <span className="text-4xl font-bold text-green-400">
                  {evaluationResult.marks} / {question?.marks || 5}
                </span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Review:
                </h3>
                <p className="text-gray-300 bg-black p-4 rounded-lg border border-gray-700 whitespace-pre-wrap">
                  {evaluationResult.review}
                </p>
              </div>
            </div>
            <div className="mt-8 flex justify-end"></div>
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {isSubmitting && (
        <div className="fixed inset-0 z-70 flex flex-col items-center justify-center bg-black bg-opacity-70">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <p className="mt-4 text-xl font-semibold text-white">
            Evaluating your submission...
          </p>
        </div>
      )}

      <div className="p-1 mb-3 font-mono font-bold flex flex-row items-center justify-between gap-10">
        <div className="flex flex-row items-center gap-10">
          <div>
            <h1 className="text-sm">Logged in as,</h1>
            <div className="text-gray-400">
              <h1 className="text-xl font-thin">
                {rollNo}, {userName}
              </h1>
              <h1 className="text-sm font-thin">{userEmail}</h1>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="btn btn-sm btn-outline btn-error tracking-wider font-poppins font-light text-xl border-2 border-amber-50 rounded-none bg-red-500 text-white">
            Logout
          </button>
        </div>

        {examStarted && (
          <div className="flex flex-col items-end">
            <span className="text-xs text-gray-400">Time Remaining</span>
            <span
              className={`text-2xl font-mono ${
                timeLeft < 300 ? "text-red-500 animate-pulse" : "text-green-400"
              }`}>
              {formatTime(timeLeft)}
            </span>
          </div>
        )}
      </div>

      {/* DIV FOR TWO SECTIONS */}
      <div className="flex flex-row">
        {/* MAIN EDITOR DIV */}
        <div className="flex flex-col">
          <div className="flex flex-row items-center justify-between  bg-[#161a1f] p-4 rounded-t-2xl overflow-hidden border border-gray-300 shadow">
            <div className="font-semibold font-poppins tracking-wider flex flex-row items-center">
              <i className="bx bx-file-code p-2 text-2xl"></i>
              <span>main.c</span>
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleOpenQuestion}
                className="btn tracking-wider font-poppins font-light text-xl border-2 border-amber-50 rounded-none bg-[#605DFF]">
                Question
              </button>
              <button
                onClick={runCode}
                className="btn  tracking-wider font-poppins font-light text-xl border-2 border-amber-50 rounded-none bg-[#605DFF]">
                <span>Run</span>
              </button>
              <button
                onClick={() => setShowConfirmModal(true)}
                className="btn  tracking-wider font-poppins font-light text-xl border-2 border-amber-50 rounded-none bg-green-600">
                <span>Submit</span>
              </button>
            </div>
          </div>

          <div className="bg-[#1E1E1E] p-5 h-[69vh] w-[50vw]  rounded-b-2xl overflow-hidden border border-gray-300 shadow">
            <Editor
              height="69vh"
              defaultLanguage="c"
              theme="vs-dark"
              // defaultValue="//Write your code here."
              value={value}
              onChange={(value) => setValue(value)}
            />
          </div>
        </div>

        {/* DIV FOR OUTPUT AND INPUT */}
        <div>
          {/* OUTPUT */}
          <div className="flex flex-col ml-10">
            <div className="flex flex-row items-center justify-between   bg-[#161a1f] p-4 rounded-t-2xl overflow-hidden border border-gray-300 shadow">
              <div className="font-semibold font-poppins tracking-wider flex flex-row items-center">
                <i className="bx bx-terminal p-2 text-2xl"></i>
                <span>Output</span>
              </div>

              <button
                onClick={() => setOutputText("")}
                className="btn tracking-wider font-poppins font-light text-xl border-2 border-amber-50 rounded-none hover:bg-red-400 ">
                Clear
              </button>
            </div>

            <div>
              <textarea
                className="bg-black h-[30vh] p-5 w-[45vw] rounded-b-2xl overflow-hidden border border-gray-300 shadow font-mono font-extrabold select-none"
                readOnly
                name=""
                id=""
                placeholder="Your output will be displayed here."
                value={outputText}></textarea>
            </div>
          </div>

          {/* INPUT */}
          <div className="flex flex-col ml-10">
            <div className="flex flex-row items-center justify-between   bg-[#161a1f] p-4 rounded-t-2xl overflow-hidden border border-gray-300 shadow">
              <div className="font-semibold font-poppins tracking-wider flex flex-row items-center">
                <i className="bx bx-keyboard p-2 text-2xl"></i>
                <span>Input</span>
              </div>
            </div>

            <div>
              <textarea
                className="bg-black h-[30vh] p-5 w-[45vw] rounded-b-2xl overflow-hidden border border-gray-300 shadow font-mono font-extrabold tracking-widest"
                name=""
                id=""
                placeholder="Enter your input here, if your program has any input."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}></textarea>
            </div>
          </div>
        </div>
        {/* END OF OUTPUT AND INPUT*/}
      </div>
      {/* END OF MAIN SECTION */}
      <footer className="w-full mt-6 py-3 px-4 flex flex-row items-center justify-between  text-gray-400 text-sm font-mono">
        <div>&copy; 2025 Created by Shivam</div>
        <div className="flex flex-row items-center gap-3">
          <div>Powered by Gemini</div>
          <img
            width="24"
            height="24"
            src="https://img.icons8.com/color/48/bard--v1.png"
            alt="bard--v1"
          />
        </div>
      </footer>
    </div>
  );
}

export default Workspace;
