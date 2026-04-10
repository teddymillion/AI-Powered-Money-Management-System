import { Router } from 'express';
import Groq from 'groq-sdk';
import { buildSummary } from '../utils/summary.js';

const router = Router();

function buildPrompt(summary) {
  const categories = summary.byCategory
    .map((item) => `${item.category}: ${item.amount.toFixed(2)}`)
    .join(', ');

  return `You are a friendly personal finance coach.

Monthly snapshot:
Income: ${summary.income} ETB
Expenses: ${summary.expenses} ETB
Savings: ${summary.savings} ETB
Expenses by category: ${categories || 'No expenses recorded'}

Return exactly 3 short, practical recommendations as a raw JSON array (no markdown, no code fences).
Each item must have: title (string), description (string), priority ("low"|"medium"|"high").`;
}

router.get('/', async (req, res) => {
  try {
    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({ error: 'GROQ_API_KEY is not set.' });
    }

    const summary = await buildSummary(req.user.id);
    const prompt = buildPrompt(summary);
    const model = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';

    const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const response = await client.chat.completions.create({
      model,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
    });

    const text = response.choices?.[0]?.message?.content || '';
    const cleaned = text.replace(/```(?:json)?\n?/g, '').replace(/```/g, '').trim();

    let insights = [];
    try {
      insights = JSON.parse(cleaned);
      if (!Array.isArray(insights)) insights = [insights];
    } catch {
      insights = [{
        title: 'Budget Health Check',
        description: cleaned.slice(0, 200) || 'Review your spending to find savings opportunities.',
        priority: 'medium',
      }];
    }

    return res.json({ generatedAt: new Date().toISOString(), insights, summary });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('AI insights error:', error?.message || error);
    return res.status(500).json({ error: error?.message || 'Failed to generate AI insights.' });
  }
});

export default router;
