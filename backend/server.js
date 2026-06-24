require("dotenv").config();

const express = require("express");
const cors = require("cors");
const Groq = require("groq-sdk");

const app = express();

app.use(cors());
app.use(express.json());

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

app.get("/", (req, res) => {
  res.send("Backend Running");
});

// Build a system prompt per interview type
function buildSystemPrompt(interviewType) {
  return `
You are an expert ${interviewType} technical interviewer.

Rules:
1. Ask one question at a time.
2. Wait for the candidate's answer before scoring it.
3. When the candidate answers, score that answer out of 10.
4. Briefly explain strengths and missing points.
5. Then ask the next question, building on previous answers where relevant.
6. Keep responses focused and not overly long.
`;
}

// Start a new interview - returns the first question
app.post("/start", async (req, res) => {
  try {
    const { interviewType } = req.body;

    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: buildSystemPrompt(interviewType) },
        {
          role: "user",
          content: "Begin the interview. Ask your first question only, do not score anything yet.",
        },
      ],
      model: "llama-3.3-70b-versatile",
    });

    res.json({ reply: completion.choices[0].message.content });
  } catch (error) {
    console.error("FULL ERROR:", error);
    res.status(500).json({ error: error.message });
  }
});

// Continue interview - now takes full conversation history so context is preserved
app.post("/chat", async (req, res) => {
  try {
    const { history, interviewType } = req.body;
    // history: array of { sender: "user" | "ai", text: string }

    const conversation = history.map((m) => ({
      role: m.sender === "user" ? "user" : "assistant",
      content: m.text,
    }));

    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: buildSystemPrompt(interviewType) },
        ...conversation,
      ],
      model: "llama-3.3-70b-versatile",
    });

    res.json({ reply: completion.choices[0].message.content });
  } catch (error) {
    console.error("FULL ERROR:", error);
    res.status(500).json({ error: error.message });
  }
});

// End interview - generates a final score report from the full transcript
app.post("/end", async (req, res) => {
  try {
    const { history, interviewType } = req.body;

    const userAnswers = history.filter((m) => m.sender === "user");

    if (userAnswers.length === 0) {
      return res.json({
        reply:
          "**No score available.** You haven't answered any questions yet, so there's nothing to evaluate. Answer at least one question, then end the interview to get your report.",
      });
    }

    const conversation = history.map((m) => ({
      role: m.sender === "user" ? "user" : "assistant",
      content: m.text,
    }));

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `
You are an expert ${interviewType} interviewer wrapping up a mock interview.
Review the entire conversation above and produce a final report with this exact structure:

**Overall Score:** X/10

**Strengths:**
- point
- point

**Areas to Improve:**
- point
- point

**Summary:** one short paragraph of overall feedback.
`,
        },
        ...conversation,
        { role: "user", content: "The interview is over. Give my final score report now." },
      ],
      model: "llama-3.3-70b-versatile",
    });

    res.json({ reply: completion.choices[0].message.content });
  } catch (error) {
    console.error("FULL ERROR:", error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});