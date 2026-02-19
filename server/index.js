import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { Groq } from "groq-sdk";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: message }],
      stream: true,
    });

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    for await (const chunk of response) {
      const token = chunk.choices[0]?.delta?.content || "";
      if (token) {
        //res.write(`data: ${token}\n\n`);
        res.write(token);
      }
    }

    res.end();
  } catch (err) {
    console.error("Groq Error:", err);
    res.status(500).send("Error on server");
  }
});

app.listen(3001, () => {
  console.log("✅ Server running on http://localhost:3001");
});
