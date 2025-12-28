import "dotenv/config";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function listModels() {
  const response = await ai.models.list();

  console.log("RAW RESPONSE:");
  console.dir(response, { depth: null });
}

listModels();
