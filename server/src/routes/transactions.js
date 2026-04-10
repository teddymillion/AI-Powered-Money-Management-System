import { Router } from 'express';
import { Transaction } from '../models/Transaction.js';
import { User } from '../models/User.js';
import { pushNotification } from './profile.js';

const router = Router();

router.post('/', async (req, res) => {
  try {
    const { type, category, amount, description, date } = req.body;

    if (!type || !category || !amount || !date) {
      return res.status(400).json({ error: 'Type, category, amount, and date are required.' });
    }

    const transaction = await Transaction.create({
      userId: req.user.id,
      type,
      category,
      amount: Number(amount),
      description: description || '',
      date: new Date(date),
    });

    // Build and persist notification
    const notif = {
      id: transaction._id.toString(),
      title: type === 'income' ? '💰 Income Added' : '💸 Expense Recorded',
      message: `${category} — ETB ${Number(amount).toLocaleString()}${description ? ` · ${description}` : ''}`,
      type: type === 'income' ? 'success' : 'info',
      read: false,
      createdAt: new Date(),
    };
    await User.findByIdAndUpdate(req.user.id, { $push: { notifications: { $each: [notif], $position: 0 } } });
    pushNotification(req.user.id, notif);

    return res.status(201).json(transaction);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to create transaction.' });
  }
});

router.get('/', async (req, res) => {
  try {
    const { type, category, sort = 'date_desc', from, to, limit = 100 } = req.query;

    const query = { userId: req.user.id };
    if (type) query.type = type;
    if (category) query.category = category;
    if (from || to) {
      query.date = {};
      if (from) query.date.$gte = new Date(from);
      if (to) query.date.$lte = new Date(to);
    }

    const sortMap = {
      date_desc: { date: -1 },
      date_asc: { date: 1 },
      amount_desc: { amount: -1 },
      amount_asc: { amount: 1 },
    };

    const transactions = await Transaction.find(query)
      .sort(sortMap[sort] || sortMap.date_desc)
      .limit(Number(limit));

    return res.json(transactions);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch transactions.' });
  }
});

export default router;
