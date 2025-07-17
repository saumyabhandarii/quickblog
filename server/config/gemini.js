// ✅ 1. Load environment variables
import dotenv from "dotenv";
dotenv.config();

// ✅ 2. Import Gemini SDK
import { GoogleGenerativeAI } from "@google/generative-ai";

// ✅ 3. Pass the API key directly as a string (NOT as object!)
const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function main(prompt) {
  try {
    const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(prompt); // 👈 don't use role/parts here
    const response = await result.response;
    return response.text(); // Returns the blog content
  } catch (error) {
    console.error("Gemini generateContent error:", error.message);
    return "Failed to generate content.";
  }
}
