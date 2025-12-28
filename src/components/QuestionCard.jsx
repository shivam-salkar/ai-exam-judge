import { useEffect, useState } from "react";

export default function QuestionCard({ open, onClose }) {
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;

    const fetchQuestion = async () => {
      try {
        setLoading(true);
        setError("");

        // 1️⃣ Check localStorage
        const stored = localStorage.getItem("examQuestion");
        if (stored) {
          setQuestion(JSON.parse(stored));
          setLoading(false);
          return;
        }

        // 2️⃣ Fetch from backend only once
        const res = await fetch("http://localhost:3001/api/question");
        const data = await res.json();

        if (data.error) throw new Error(data.error);

        // 3️⃣ Store + set
        localStorage.setItem("examQuestion", JSON.stringify(data));
        setQuestion(data);

      } catch (err) {
        console.error(err);
        setError("Failed to load question");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestion();
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed top-4 left-1/2 z-50 -translate-x-1/2 w-[90%] max-w-3xl">
      <div className="card bg-base-100 shadow-xl border border-primary">
        <div className="text-xl text-gray-400 card-body">

          <div className="flex justify-between items-center">
            <h2 className="text-2xl text-white font-bold">📄 Question</h2>
            <button
              className="btn btn-sm btn-circle btn-error text-2xl font-mono font-extrabold"
              onClick={onClose}
            >
              x
            </button>
          </div>

          {loading && <p>Generating question...</p>}
          {error && <p className="text-error">{error}</p>}

          {question && (
            <>
              <p className="mt-2 font-semibold">{question.question}</p>

              <div className="text-sm opacity-80 mt-1">
                <b>Topic:</b> {question.topic} · <b>Marks:</b> {question.marks}
              </div>

              <h4 className="mt-3 text-white font-semibold">Constraints</h4>
              <ul className="list-disc ml-5">
                {question.constraints.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>

              <h4 className="mt-3 text-white font-semibold">Sample Input</h4>
              <pre className="bg-base-200 p-2 rounded">
                {question.sampleInput}
              </pre>

              <h4 className="mt-3 text-white font-semibold">Sample Output</h4>
              <pre className="bg-base-200 p-2 rounded">
                {question.sampleOutput}
              </pre>
            </>
          )}

        </div>
      </div>
    </div>
  );
}
