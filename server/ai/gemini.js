import "../config.js";

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY
);

export const generateWithGemini =
  async (prompt) => {
    console.log(
      "GEMINI API KEY:",
      process.env.GEMINI_API_KEY
        ? "loaded"
        : "MISSING"
    );

    console.log(
      "Provider:",
      process.env.AI_PROVIDER
    );

    try {
      const model =
        genAI.getGenerativeModel({
          model: "gemini-2.0-flash",
        });

      const result =
        await model.generateContent({
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],

          generationConfig: {
            maxOutputTokens: 120,
            temperature: 0.7,
          },
        });

      const response =
        await result.response;

      const text = response.text();

      console.log(
        "Gemini response:",
        text
      );

      return text;
    } catch (error) {
      console.error(
        "Gemini generation error:",
        error
      );

      throw new Error(
        "Failed to generate AI response"
      );
    }
  };