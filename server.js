import express from "express";
import { GoogleGenAI } from "@google/genai";

const app = express();
app.use(express.json({ limit: "1mb" }));
app.use(express.static("."));

const PORT = process.env.PORT || 3000;
const API_KEY = process.env.GEMINI_API_KEY;
const MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

const ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;

app.post("/api/chat", async (req, res) => {
  try {
    if (!ai) {
      return res.status(500).json({
        error: "کلید Gemini روی سرور تنظیم نشده است."
      });
    }

    const message = String(req.body?.message || "").trim();
    if (!message) {
      return res.status(400).json({ error: "پیام خالی است." });
    }

    const response = await ai.models.generateContent({
      model: MODEL,
      contents: message
    });

    const reply = response?.text?.trim();
    if (!reply) {
      return res.status(502).json({ error: "Gemini پاسخی برنگرداند." });
    }

    res.json({ reply });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: error?.message || "خطا در ارتباط با Gemini."
    });
  }
});

app.listen(PORT, () => {
  console.log(`AI assistant server running on port ${PORT}`);
});
