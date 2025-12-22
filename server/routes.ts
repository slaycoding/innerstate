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

      const systemPrompt = `You are a calm, supportive emotional reflection companion. Your role is to help users gently observe and understand their current emotional state.

When a user shares how they feel, respond with:
1. A brief, empathetic reflection (3-5 sentences) that acknowledges their feeling without judgment
2. A short metaphor that captures the essence of their emotional state

Your tone should be:
- Calm and gentle
- Non-judgmental and supportive
- Intimate but not intrusive
- Poetic but accessible

Do not:
- Give advice or solutions
- Diagnose or analyze
- Use clinical language
- Be overly cheerful or dismissive

Respond ONLY with valid JSON in this exact format:
{
  "reflection": "Your empathetic reflection here...",
  "metaphor": "Your metaphor here...",
  "emotionalTone": "one word describing the emotional tone (e.g., calm, anxious, hopeful, tired, overwhelmed, peaceful)"
}`;

      const response = await openai.chat.completions.create({
        model: "gpt-5.1",
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
      
      res.json({
        reflection: parsed.reflection || "I hear you. Take a moment to simply be with whatever you're feeling.",
        metaphor: parsed.metaphor || "Like a leaf floating on still water, your feelings are simply present.",
        emotionalTone: parsed.emotionalTone || "present",
      });
    } catch (error) {
      console.error("Reflection error:", error);
      res.status(500).json({ 
        error: "Unable to process reflection",
        reflection: "I hear you. Take a moment to simply be with whatever you're feeling.",
        metaphor: "Like a leaf floating on still water, your feelings are simply present.",
        emotionalTone: "present",
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
