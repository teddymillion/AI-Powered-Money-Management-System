import { Router } from 'express';
import { Transaction } from '../models/Transaction.js';
import { User } from '../models/User.js';
import { pushNotification } from '../utils/notificationBus.js';

const router = Router();

// Helper — persist + push a notification
async function sendNotification(userId, notif) {
  await User.findByIdAndUpdate(userId, {
    $push: { notifications: { $each: [notif], $position: 0 } },
  });
  pushNotification(userId, notif);
}

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

    const amountNum = Number(amount);
    const amountStr = `ETB ${amountNum.toLocaleString()}`;

    // ── 1. Transaction notification ──────────────────────────
    await sendNotification(req.user.id, {
      id: `txn-${transaction._id}`,
      title: type === 'income' ? '💰 Income Added' : '💸 Expense Recorded',
      message: `${category} — ${amountStr}${description ? ` · ${description}` : ''}`,
      type: type === 'income' ? 'success' : 'info',
      read: false,
      createdAt: new Date(),
    });

    // ── 2. High-expense alert (expense > ETB 5,000) ──────────
    if (type === 'expense' && amountNum >= 5000) {
      await sendNotification(req.user.id, {
        id: `high-${transaction._id}`,
        title: '⚠️ High Expense Alert',
        message: `You just recorded a large expense of ${amountStr} in ${category}. Review your budget.`,
        type: 'warning',
        read: false,
        createdAt: new Date(),
      });
    }

    // ── 3. Monthly expense spike check ───────────────────────
    // If total expenses this month exceed total income this month, warn
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const [monthlyExpenses, monthlyIncome] = await Promise.all([
      Transaction.aggregate([
        { $match: { userId: transaction.userId, type: 'expense', date: { $gte: monthStart } } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
      Transaction.aggregate([
        { $match: { userId: transaction.userId, type: 'income', date: { $gte: monthStart } } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
    ]);

    const totalExpense = monthlyExpenses[0]?.total || 0;
    const totalIncome  = monthlyIncome[0]?.total || 0;

    if (type === 'expense' && totalIncome > 0 && totalExpense > totalIncome) {
      await sendNotification(req.user.id, {
        id: `overspend-${Date.now()}`,
        title: '🚨 Overspending This Month',
        message: `Your expenses (ETB ${totalExpense.toLocaleString()}) have exceeded your income (ETB ${totalIncome.toLocaleString()}) this month.`,
        type: 'error',
        read: false,
        createdAt: new Date(),
      });
    }

    return res.status(201).json(transaction);
  } catch (error) {
    console.error('Transaction error:', error);
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
      if (to)   query.date.$lte = new Date(to);
    }

    const sortMap = {
      date_desc:   { date: -1 },
      date_asc:    { date: 1 },
      amount_desc: { amount: -1 },
      amount_asc:  { amount: 1 },
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
