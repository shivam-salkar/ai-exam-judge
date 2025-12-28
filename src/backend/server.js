import express from "express";
import cors from "cors";
import { generateQuestion } from "./questionGenerator.js";

const app = express();
app.use(cors());
app.use(express.json());

let lastRequestTime = 0;

app.get("/api/question", async (req, res) => {
  res.set("Cache-Control", "no-store, no-cache, must-revalidate, private");

  const now = Date.now();
  if (now - lastRequestTime < 5000) {
    return res.status(429).json({ error: "Too many requests" });
  }
  lastRequestTime = now;

  try {
    console.log("Generating new question...");
    const question = await generateQuestion();
    res.json(JSON.parse(question));
  } catch (err) {
    console.error("Error generating question:", err);
    res.status(500).json({ error: "Failed to generate question" });
  }
});

app.listen(3001, () => {
  console.log("Backend running on http://localhost:3001");
});
