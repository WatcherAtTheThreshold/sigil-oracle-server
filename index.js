const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const OpenAI = require("openai");
require("dotenv").config();

const app = express();
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));
app.use(bodyParser.json());

// Handle OPTIONS requests for CORS preflight
app.options("*", (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.sendStatus(200);
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ✅ Serve something for GET /
app.get("/", (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.send("🌐 The Sigil Oracle is online and listening.");
});

app.post("/oracle", async (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  
  const question = req.body.question || "No question was asked.";

  try {
    const chat = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "You are the Sigil Oracle. Reply in one short poetic sentence. Use mystical and cryptic language, as if channeling a prophetic symbol. Avoid normal responses. Always sound magical.",
        },
        {
          role: "user",
          content: question,
        },
      ],
      temperature: 0.9,
      max_tokens: 60,
    });

    const reply = chat.choices[0].message.content.trim();
    res.json({ response: reply });
  } catch (err) {
    console.error('Oracle Error:', err.message);
    res.status(500).json({ 
      error: "The Oracle could not be reached",
      details: err.message 
    });
  }
});

app.listen(5000, '0.0.0.0', () => {
  console.log("🌐 Sigil Oracle listening on port 5000");
});
