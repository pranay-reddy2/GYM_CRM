import "../config.js";

export const generateWithOpenRouter =
  async (prompt) => {
    console.log(
      "OPENROUTER API KEY:",
      process.env.OPENROUTER_API_KEY
        ? "loaded"
        : "MISSING"
    );

    console.log(
      "Provider:",
      process.env.AI_PROVIDER
    );

    try {
      const res = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          method: "POST",

          headers: {
            Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,

            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
        model: "openai/gpt-4.1-mini",

            messages: [
              {
                role: "user",
                content: prompt,
              },
            ],

            max_tokens: 120,

            temperature: 0.7,
          }),
        }
      );

      // Better Error Logging
      if (!res.ok) {
        const errorBody =
          await res.json();

        console.error(
          "OpenRouter error body:",
          errorBody
        );

        throw new Error(
          errorBody?.error?.message ||
            "OpenRouter request failed"
        );
      }

      const data = await res.json();

      console.log(
        "OpenRouter response:",
        data
      );

      return data.choices[0].message.content;
    } catch (error) {
      console.error(
        "OpenRouter generation error:",
        error
      );

      throw new Error(
        "Failed to generate AI response"
      );
    }
  };