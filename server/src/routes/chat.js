import { Router } from 'express';
import Groq from 'groq-sdk';
import { buildSummary } from '../utils/summary.js';

const router = Router();

router.post('/', async (req, res) => {
  try {
    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({ error: 'GROQ_API_KEY is not set.' });
    }

    const { message } = req.body;
    if (!message) return res.status(400).json({ error: 'message is required.' });

    const summary = await buildSummary(req.user.id);
    const model = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';
    const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const systemPrompt = `You are a helpful personal finance assistant powered by Groq's Llama 3.3 70B model.
If the user asks what model you are, what AI you are, who made you, or anything about your identity, always respond with: "I am powered by Llama 3.3 70B, running on Groq's infrastructure — a free, fast AI service."
The user's current monthly snapshot:
- Income: ${summary.income} ETB
- Expenses: ${summary.expenses} ETB
- Savings: ${summary.savings} ETB
- Top expense categories: ${summary.byCategory.slice(0, 5).map((c) => `${c.category} (${c.amount} ETB)`).join(', ') || 'none'}

Give concise, actionable advice. Keep responses under 150 words.`;

    const response = await client.chat.completions.create({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message },
      ],
      temperature: 0.5,
    });

    const reply = response.choices?.[0]?.message?.content || 'I could not generate a response.';
    return res.json({ reply });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Chat error:', error?.message || error);
    return res.status(500).json({ error: error?.message || 'Failed to get AI response.' });
  }
});

export default router;
