export const callGemini = async (prompt) => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    console.error("Error: Gemini API key is missing in .env file.");
    return "AI system offline: API key missing.";
  }

  // FIXED: Changed model to gemini-1.5-flash (Most stable for API)
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  const payload = {
    contents: [{ parts: [{ text: prompt }] }]
  };

  const maxRetries = 3;
  let delay = 1000;

  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      // FIXED: Catching the EXACT error from Google
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Google API Error:", errorData); // Ye aapko console me sachai batayega
        throw new Error(errorData.error?.message || "API request failed");
      }

      const data = await response.json();

      return (
        data.candidates?.[0]?.content?.parts?.[0]?.text ||
        "No response generated."
      );

    } catch (error) {
      console.error(`Attempt ${i + 1} failed:`, error.message);
      
      if (i === maxRetries - 1) {
        return "AI service unavailable right now. Please try again later.";
      }

      await new Promise(resolve => setTimeout(resolve, delay));
      delay *= 2;
    }
  }
};