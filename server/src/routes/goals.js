import { Router } from 'express';
import { Goal } from '../models/Goal.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const goals = await Goal.find({ userId: req.user.id }).sort({ createdAt: -1 });
    return res.json(goals);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch goals.' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, target, current, icon, deadline } = req.body;
    if (!name || !target) return res.status(400).json({ error: 'Name and target are required.' });
    const goal = await Goal.create({
      userId: req.user.id,
      name,
      target: Number(target),
      current: Number(current || 0),
      icon: icon || '🎯',
      deadline: deadline ? new Date(deadline) : null,
    });
    return res.status(201).json(goal);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to create goal.' });
  }
});

router.patch('/:id', async (req, res) => {
  try {
    const { name, target, current, icon, deadline } = req.body;
    const update = {};
    if (name !== undefined)     update.name     = name;
    if (target !== undefined)   update.target   = Number(target);
    if (current !== undefined)  update.current  = Number(current);
    if (icon !== undefined)     update.icon     = icon;
    if (deadline !== undefined) update.deadline = deadline ? new Date(deadline) : null;

    const goal = await Goal.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      update,
      { new: true }
    );
    if (!goal) return res.status(404).json({ error: 'Goal not found.' });
    return res.json(goal);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to update goal.' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await Goal.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    return res.json({ message: 'Goal deleted.' });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to delete goal.' });
  }
});

export default router;
