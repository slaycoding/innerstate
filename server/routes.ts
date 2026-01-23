import type { Express } from "express";
import { createServer, type Server } from "node:http";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/reflect", async (req, res) => {
    try {
      const { input } = req.body;

      if (!input || typeof input !== "string" || input.trim().length === 0) {
        return res.status(400).json({ error: "Input is required" });
      }

      const systemPrompt = `
Respond ONLY with valid JSON in this exact format:
{
  "reflection": "Your empathetic reflection here...",
  "metaphor": "Your metaphor here...",
  "emotionalTone": "one word describing the emotional tone (e.g., calm, anxious, hopeful, tired, overwhelmed, peaceful)"
}
`;

      const response = await openai.chat.completions.create({
        // gpt-5.1 почти наверняка не поддерживается Replit AI proxy
        // поэтому сразу ставим стабильную модель
        model: "gpt-4.1-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `How I feel right now: ${input.trim()}` },
        ],
        max_completion_tokens: 500,
        response_format: { type: "json_object" },
      });

      const content = response.choices[0]?.message?.content;

      if (!content) {
        throw new Error("No response from AI");
      }

      const parsed = JSON.parse(content);

      return res.status(200).json({
        reflection: parsed.reflection,
        metaphor: parsed.metaphor,
        emotionalTone: parsed.emotionalTone || "present",
      });
    } catch (error: any) {
      console.error("Reflection error FULL:", error);

      return res.status(500).json({
        error: error?.message || "Unable to process reflection",
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
