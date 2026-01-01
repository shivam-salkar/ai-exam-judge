import "dotenv/config";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI(process.env.GEMINI_API_KEY);

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
  // Removed server-side caching to ensure unique questions per user/session
  try {
    const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(
      prompt + `\n\nRandom seed: ${Date.now()}`
    );
    const response = await result.response;
    const rawText = response.text();

    if (!rawText) {
      throw new Error("Empty response from Gemini");
    }

    const jsonText = extractJSON(rawText);
    return jsonText;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
}

export async function evaluateSubmission(question, code, output) {
  const evaluationPrompt = `
You are an expert C programming examiner.
Evaluate the following student submission based on the question provided.

Question:
${JSON.stringify(question, null, 2)}

Student Code:
${code}

Student Output:
${output}

Rules:
- Compare the code and output against the question requirements and constraints.
- Assign marks out of ${question.marks || 5}.
- Provide a brief, constructive review.
- Output format (JSON only, no explanation, no markdown):
{
  "marks": number,
  "review": "string"
}
`;

  try {
    const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(evaluationPrompt);
    const response = await result.response;
    const rawText = response.text();

    if (!rawText) {
      throw new Error("Empty response from Gemini");
    }

    const jsonText = extractJSON(rawText);
    return jsonText;
  } catch (error) {
    console.error("Gemini API Evaluation Error:", error);
    throw error;
  }
}
