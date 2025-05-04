import express from "express";
import dotenv from "dotenv";
import { OpenAI } from "openai";

dotenv.config();
console.log("API Key:", process.env.OPENAI_API_KEY); // 🔍 TEMP DEBUG

const app = express();
const PORT = process.env.PORT || 3000;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  });

app.get("/predict", async (req, res) => {
  const asset = req.query.asset || "bitcoin";

  try {
    const chat = await openai.chat.completions.create({
      model: "openai/gpt-3.5-turbo",  // ✅ IMPORTANT: This must match exactly
      messages: [
        { role: "system", content: "You are a helpful financial assistant." },
      { role: "user", content: `Give a confident, speculative prediction about the price movement of ${asset} within the next 5 hours with assumed price. Even if uncertain, provide a clear up/down forecast with reasoning like a trading analyst.` }

      ]
    });

    res.json({
      asset,
      prediction: chat.choices[0].message.content
    });
  } catch (err) {
    console.error("❌ GPT API Error:", err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running at http://0.0.0.0:${PORT}`);
});
