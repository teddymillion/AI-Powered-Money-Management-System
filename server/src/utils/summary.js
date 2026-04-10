import mongoose from 'mongoose';
import { Transaction } from '../models/Transaction.js';

function startOfMonth(date) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1));
}

function addMonths(date, count) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + count, 1));
}

function startOfWeek(date) {
  const day = date.getUTCDay();
  const diff = (day + 6) % 7; // Monday start
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() - diff));
}

async function sumByType(userId, start, end, type) {
  const [result] = await Transaction.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        type,
        date: { $gte: start, $lt: end },
      },
    },
    { $group: { _id: null, total: { $sum: '$amount' } } },
  ]);

  return result?.total || 0;
}

async function categoryBreakdown(userId, start, end) {
  const results = await Transaction.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        type: 'expense',
        date: { $gte: start, $lt: end },
      },
    },
    { $group: { _id: '$category', amount: { $sum: '$amount' } } },
    { $sort: { amount: -1 } },
  ]);

  const total = results.reduce((sum, item) => sum + item.amount, 0);

  return results.map((item) => ({
    category: item._id,
    amount: item.amount,
    percentage: total ? (item.amount / total) * 100 : 0,
  }));
}

export async function buildSummary(userId, referenceDate = new Date()) {
  const now = new Date(referenceDate);
  const monthStart = startOfMonth(now);
  const monthEnd = addMonths(monthStart, 1);

  const [income, expenses] = await Promise.all([
    sumByType(userId, monthStart, monthEnd, 'income'),
    sumByType(userId, monthStart, monthEnd, 'expense'),
  ]);

  const savings = income - expenses;

  const byCategory = await categoryBreakdown(userId, monthStart, monthEnd);

  const monthlyTrends = [];
  for (let i = 3; i >= 0; i -= 1) {
    const start = addMonths(monthStart, -i);
    const end = addMonths(start, 1);
    const [monthIncome, monthExpenses] = await Promise.all([
      sumByType(userId, start, end, 'income'),
      sumByType(userId, start, end, 'expense'),
    ]);
    monthlyTrends.push({
      period: start.toLocaleString('en-US', { month: 'short' }),
      income: monthIncome,
      expenses: monthExpenses,
      savings: monthIncome - monthExpenses,
    });
  }

  const weeklyTrends = [];
  const weekStart = startOfWeek(now);
  for (let i = 3; i >= 0; i -= 1) {
    const start = new Date(weekStart);
    start.setUTCDate(start.getUTCDate() - i * 7);
    const end = new Date(start);
    end.setUTCDate(end.getUTCDate() + 7);

    const [weekIncome, weekExpenses] = await Promise.all([
      sumByType(userId, start, end, 'income'),
      sumByType(userId, start, end, 'expense'),
    ]);

    weeklyTrends.push({
      period: `Week ${4 - i}`,
      income: weekIncome,
      expenses: weekExpenses,
      savings: weekIncome - weekExpenses,
    });
  }

  const yearlyTrends = [];
  const currentYear = now.getUTCFullYear();
  for (let quarter = 1; quarter <= 4; quarter += 1) {
    const quarterStart = new Date(Date.UTC(currentYear, (quarter - 1) * 3, 1));
    const quarterEnd = new Date(Date.UTC(currentYear, quarter * 3, 1));
    const [qIncome, qExpenses] = await Promise.all([
      sumByType(userId, quarterStart, quarterEnd, 'income'),
      sumByType(userId, quarterStart, quarterEnd, 'expense'),
    ]);

    yearlyTrends.push({
      period: `Q${quarter}`,
      income: qIncome,
      expenses: qExpenses,
      savings: qIncome - qExpenses,
    });
  }

  return {
    month: monthStart.toISOString(),
    income,
    expenses,
    savings,
    balance: savings,
    byCategory,
    trends: {
      weekly: weeklyTrends,
      monthly: monthlyTrends,
      yearly: yearlyTrends,
    },
  };
}
