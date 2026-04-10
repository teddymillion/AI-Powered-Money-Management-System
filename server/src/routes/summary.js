import { Router } from 'express';
import { buildSummary } from '../utils/summary.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const summary = await buildSummary(req.user.id);
    return res.json(summary);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to generate summary.' });
  }
});

export default router;
