import express from "express";
import cors from "cors";
import { generateQuestion } from "./questionGenerator.js";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/question", async (req, res) => {
  try {
    const text = await generateQuestion();
    console.log("RAW GEMINI RESPONSE:\n", text);

    res.json(JSON.parse(text));
  } catch (err) {
    console.error("GENERATION ERROR:", err);
    res.status(500).json({
      error: err.message || "Unknown error",
    });
  }
});


app.listen(3001, () => {
  console.log("Backend running on http://localhost:3001");
});
