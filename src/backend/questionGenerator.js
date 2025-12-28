import "dotenv/config";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const prompt = `
You are an experienced university-level C programming test paper setter.

Target students: First semester undergraduate students
Subject: C Programming
Difficulty: Easy
Marks: 1 question only

Syllabus coverage (choose ONE topic per question):
- Functions
- Recursion
- 1D and 2D arrays
- Strings
- Basic control structures (if, loops)

Rules:
- Generate exactly ONE coding question
- The question must be solvable using standard C (C99)
- Do NOT include pointers beyond basic array usage
- Do NOT include dynamic memory allocation
- DO NOT include passing arrays to functions
- Avoid tricky or ambiguous wording
- The question should be suitable for a written or lab exam

Output format (JSON only, no explanation, no markdown):

{
  "question": "Clear problem statement here",
  "topic": "functions | recursion | arrays | 2d arrays | strings",
  "marks": 5,
  "constraints": [
    "constraint 1",
    "constraint 2"
  ],
  "sampleInput": "example input",
  "sampleOutput": "expected output"
}
`;

function extractJSON(text) {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");

  if (start === -1 || end === -1) {
    throw new Error("No JSON found in Gemini response");
  }

  return text.slice(start, end + 1);
}


export async function generateQuestion() {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-lite",
    contents: prompt,
    generationConfig: {
      temperature: 0.3,
    },
  });

  const rawText = response.text;
  const jsonText = extractJSON(rawText);

  return jsonText;
}
