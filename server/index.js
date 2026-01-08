import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { OpenAI } from 'openai';    

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post('/api/chat', async (req, res) => {
    try {
        const { message } = req.body;

        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: message }],
            stream: true
        });

        res.setHeader("Content-Type", "text/event-stream");
        res.setHeader("Cache-Control", "no-cache");
        res.setHeader("Connection", "keep-alive");

        for await (const chunk of response) {
            const token = chunk.choices[0]?.delta?.content || "";
            res.write(`data: ${token}\n\n`);
        }

        res.end();
    }
    catch (err) {
        console.error(err);
        res.status(500).send("Error on server");
    }
});


app.listen(3001, () => {
  console.log("Server running on http://localhost:3001");
});