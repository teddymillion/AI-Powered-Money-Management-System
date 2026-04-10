import { getCategoryMeta } from './categories';

export function formatCurrency(amount: number) {
  return amount.toLocaleString('en-US', { maximumFractionDigits: 0 });
}

export function normalizeTransactions(transactions: any[]) {
  return transactions.map((tx) => {
    const meta = getCategoryMeta(tx.category);
    return {
      id: tx._id || tx.id,
      category: meta.label,
      categoryId: tx.category,
      amount: tx.amount,
      description: tx.description || meta.label,
      date: new Date(tx.date),
      type: tx.type,
      categoryIcon: meta.icon,
    };
  });
}

export function buildCategorySpending(items: { category: string; amount: number; percentage?: number }[]) {
  return items.map((item) => {
    const meta = getCategoryMeta(item.category);
    return {
      category: meta.label,
      amount: item.amount,
      percentage: item.percentage ?? 0,
    };
  });
}
