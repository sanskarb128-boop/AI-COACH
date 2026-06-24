const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: "PASTE_YOUR_KEY_HERE",
});

async function run() {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: "Say hello",
  });

  console.log(response.text);
}

run().catch(console.error);