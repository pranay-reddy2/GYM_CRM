import { generateWithGemini } from "./gemini.js";

import { generateWithOpenRouter } from "./openrouter.js";

const AI_PROVIDER =
  process.env.AI_PROVIDER || "gemini";

export const generateMessage = async (
  prompt
) => {
  switch (AI_PROVIDER) {
    case "gemini":
      return await generateWithGemini(
        prompt
      );

    case "openrouter":
      return await generateWithOpenRouter(
        prompt
      );

    default:
      throw new Error(
        `Unsupported AI provider: ${AI_PROVIDER}`
      );
  }
};