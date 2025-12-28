import { useEffect, useState } from "react";

export default function QuestionCard({
  open,
  onClose,
  question,
  loading,
  error,
  examStarted,
  onStartExam,
}) {
  if (!open) return null;

  return (
    <div className="fixed top-4 left-1/2 z-50 -translate-x-1/2 w-[90%] max-w-3xl">
      <div className="card bg-base-100 shadow-xl border border-primary">
        <div className="text-xl text-gray-400 card-body">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl text-white font-bold">📄 Question</h2>
            <button
              className="btn btn-sm btn-circle btn-error text-2xl font-mono font-extrabold"
              onClick={onClose}>
              x
            </button>
          </div>

          {error && (
            <div className="alert alert-error my-4">
              <span>{error}</span>
            </div>
          )}

          {!examStarted ? (
            <div className="flex flex-col items-center justify-center py-10">
              <h3 className="text-lg font-bold mb-4">Ready to start?</h3>
              <p className="mb-6 text-center">
                Once you click the button below, the timer will start and you
                will see your question.
                <br />
                Good luck!
              </p>
              <button
                className="btn btn-primary btn-lg font-bold tracking-wider"
                onClick={onStartExam}
                disabled={loading || !!error}>
                {loading ? (
                  <span className="loading loading-spinner"></span>
                ) : (
                  "Start Exam"
                )}
              </button>
              {loading && (
                <p className="text-sm mt-2 text-gray-400">
                  Preparing your question...
                </p>
              )}
            </div>
          ) : question ? (
            <>
              <p className="mt-2 font-semibold">{question.question}</p>

              <div className="text-sm opacity-80 mt-1">
                <b>Topic:</b> {question.topic} · <b>Marks:</b> {question.marks}
              </div>

              <h4 className="mt-3 text-white font-semibold">Constraints</h4>
              <ul className="list-disc ml-5">
                {question.constraints &&
                  question.constraints.map((c, i) => <li key={i}>{c}</li>)}
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
          ) : (
            <div className="flex flex-col items-center justify-center p-10">
              {loading ? (
                <>
                  <span className="loading loading-spinner loading-lg"></span>
                  <p className="mt-4">Generating question...</p>
                </>
              ) : (
                <p>Question not available.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
