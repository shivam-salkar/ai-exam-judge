import { useState } from "react";
import { Editor } from "@monaco-editor/react";
import axios from "axios";
import { auth } from "../src/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import {db} from "../src/firebase"
import { useEffect } from "react";


function Workspace() {
  const [value, setValue] = useState("");
  const [outputText, setOutputText] = useState("");
  const [inputText, setInputText] = useState("");
  const [userID, setUserID] = useState("");
  const [userName, setUserName] = useState("");
  const [rollNo, setRollNo] = useState("");
  const [userEmail, setUserEmail] = useState("");


  const isMobile = window.innerWidth < 768;

  onAuthStateChanged(auth, (firebaseUser) => {
    setUserID(firebaseUser.uid);
  });

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) return;
  
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
    });
  
    return () => unsub();
  }, []);
  

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
        stdin: inputText,
      });
      const { run } = res.data;
      const combinedOutput = [run?.stdout, run?.stderr]
        .filter(Boolean)
        .join(run?.stdout && run?.stderr ? "\n" : "");
      setOutputText(combinedOutput);
    } catch (error) {
      setOutputText("Error running code. \n " + error);
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
    <div className="p-5 h-screen">
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
                onClick={runCode}
                className="btn  tracking-wider font-poppins font-light text-xl border-2 border-amber-50 rounded-none bg-[#605DFF]"
              >
                <span>Run</span>
              </button>
              <button className="btn  tracking-wider font-poppins font-light text-xl border-2 border-amber-50 rounded-none bg-green-600">
                <span>Submit</span>
              </button>
            </div>
          </div>

          <div className="bg-[#1E1E1E] p-5 h-[80vh] w-[50vw]  rounded-b-2xl overflow-hidden border border-gray-300 shadow">
            <Editor
              height="75vh"
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
                className="btn tracking-wider font-poppins font-light text-xl border-2 border-amber-50 rounded-none hover:bg-red-400 "
              >
                Clear
              </button>
            </div>

            <div>
              <textarea
                className="bg-black h-[40vh] p-5 w-[45vw] rounded-b-2xl overflow-hidden border border-gray-300 shadow font-mono font-extrabold select-none"
                readOnly
                name=""
                id=""
                placeholder="Your output will be displayed here."
                value={outputText}
              ></textarea>
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
                onChange={(e) => setInputText(e.target.value)}
              ></textarea>
            </div>
          </div>
        </div>
        {/* END OF OUTPUT AND INPUT*/}
      </div>
      {/* END OF MAIN SECTION */}
    </div>
  );
}

export default Workspace;