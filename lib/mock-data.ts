// Mock data for the personal finance app

export interface Transaction {
  id: string;
  category: string;
  amount: number;
  description: string;
  date: Date;
  categoryIcon: string;
}

export interface OverviewData {
  income: number;
  expenses: number;
  savings: number;
  balance: number;
}

export const CATEGORIES = [
  { id: 'food', label: 'Food & Dining', icon: '🍽️' },
  { id: 'transport', label: 'Transport', icon: '🚗' },
  { id: 'rent', label: 'Rent & Housing', icon: '🏠' },
  { id: 'utilities', label: 'Utilities', icon: '💡' },
  { id: 'shopping', label: 'Shopping', icon: '🛍️' },
  { id: 'entertainment', label: 'Entertainment', icon: '🎬' },
  { id: 'healthcare', label: 'Healthcare', icon: '🏥' },
  { id: 'education', label: 'Education', icon: '📚' },
  { id: 'savings', label: 'Savings', icon: '💰' },
  { id: 'other', label: 'Other', icon: '📌' },
];

export const TRANSACTIONS: Transaction[] = [
  {
    id: '1',
    category: 'food',
    amount: 450,
    description: 'Breakfast at cafe',
    date: new Date(2024, 3, 1),
    categoryIcon: '🍽️',
  },
  {
    id: '2',
    category: 'transport',
    amount: 200,
    description: 'Taxi to office',
    date: new Date(2024, 3, 1),
    categoryIcon: '🚗',
  },
  {
    id: '3',
    category: 'utilities',
    amount: 800,
    description: 'Electricity bill',
    date: new Date(2024, 2, 28),
    categoryIcon: '💡',
  },
  {
    id: '4',
    category: 'shopping',
    amount: 1200,
    description: 'Groceries shopping',
    date: new Date(2024, 2, 27),
    categoryIcon: '🛍️',
  },
  {
    id: '5',
    category: 'rent',
    amount: 3500,
    description: 'Monthly rent',
    date: new Date(2024, 2, 25),
    categoryIcon: '🏠',
  },
  {
    id: '6',
    category: 'entertainment',
    amount: 350,
    description: 'Movie tickets',
    date: new Date(2024, 2, 24),
    categoryIcon: '🎬',
  },
  {
    id: '7',
    category: 'healthcare',
    amount: 600,
    description: 'Doctor visit',
    date: new Date(2024, 2, 20),
    categoryIcon: '🏥',
  },
  {
    id: '8',
    category: 'education',
    amount: 2000,
    description: 'Online course',
    date: new Date(2024, 2, 15),
    categoryIcon: '📚',
  },
];

export const MONTHLY_OVERVIEW: OverviewData = {
  income: 15000,
  expenses: 9100,
  savings: 5900,
  balance: 45000,
};

export const SPENDING_BY_CATEGORY = [
  { category: 'Food & Dining', amount: 1200, percentage: 13.2 },
  { category: 'Transport', amount: 850, percentage: 9.3 },
  { category: 'Rent & Housing', amount: 3500, percentage: 38.4 },
  { category: 'Utilities', amount: 800, percentage: 8.8 },
  { category: 'Shopping', amount: 1200, percentage: 13.2 },
  { category: 'Entertainment', amount: 500, percentage: 5.5 },
  { category: 'Healthcare', amount: 600, percentage: 6.6 },
  { category: 'Education', amount: 2000, percentage: 22.0 },
];

export const MONTHLY_TRENDS = [
  { month: 'Jan', income: 15000, expenses: 8500, savings: 6500 },
  { month: 'Feb', income: 15000, expenses: 8800, savings: 6200 },
  { month: 'Mar', income: 15000, expenses: 9100, savings: 5900 },
  { month: 'Apr', income: 16000, expenses: 9200, savings: 6800 },
];

export const AI_INSIGHTS = [
  {
    title: 'Rent Optimization',
    description: 'Your rent is 38% of your monthly income. Consider looking for alternatives.',
    priority: 'medium',
  },
  {
    title: 'Savings Goal',
    description: 'You&apos;re on track! Save 5,900 ETB this month. Keep up the good work.',
    priority: 'high',
  },
  {
    title: 'Food Spending',
    description: 'Your food spending is above average. Try meal planning to save 200-300 ETB.',
    priority: 'low',
  },
];

export const BUDGET_GOALS = [
  {
    id: '1',
    name: 'Emergency Fund',
    target: 50000,
    current: 15000,
    icon: '🆘',
    category: 'savings',
  },
  {
    id: '2',
    name: 'Vacation',
    target: 20000,
    current: 8000,
    icon: '✈️',
    category: 'entertainment',
  },
  {
    id: '3',
    name: 'New Laptop',
    target: 30000,
    current: 12000,
    icon: '💻',
    category: 'shopping',
  },
  {
    id: '4',
    name: 'Professional Development',
    target: 15000,
    current: 9000,
    icon: '🎓',
    category: 'education',
  },
];
