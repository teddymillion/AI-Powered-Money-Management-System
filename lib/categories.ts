export interface CategoryItem {
  id: string;
  label: string;
  icon: string;
  type?: 'income' | 'expense';
}

export const CATEGORIES: CategoryItem[] = [
  { id: 'salary',        label: 'Salary',          icon: '\uD83D\uDCB0', type: 'income' },
  { id: 'freelance',     label: 'Freelance',        icon: '\uD83D\uDCBB', type: 'income' },
  { id: 'food',          label: 'Food & Dining',    icon: '\uD83C\uDF7D\uFE0F', type: 'expense' },
  { id: 'transport',     label: 'Transport',        icon: '\uD83D\uDE97', type: 'expense' },
  { id: 'rent',          label: 'Rent & Housing',   icon: '\uD83C\uDFE0', type: 'expense' },
  { id: 'utilities',     label: 'Utilities',        icon: '\uD83D\uDCA1', type: 'expense' },
  { id: 'shopping',      label: 'Shopping',         icon: '\uD83D\uDED2', type: 'expense' },
  { id: 'entertainment', label: 'Entertainment',    icon: '\uD83C\uDFAC', type: 'expense' },
  { id: 'healthcare',    label: 'Healthcare',       icon: '\uD83C\uDFE5', type: 'expense' },
  { id: 'education',     label: 'Education',        icon: '\uD83D\uDCDA', type: 'expense' },
  { id: 'savings',       label: 'Savings',          icon: '\uD83D\uDCB0', type: 'income' },
  { id: 'other',         label: 'Other',            icon: '\uD83D\uDCCC' },
];

export const CATEGORY_MAP = new Map(CATEGORIES.map((item) => [item.id, item]));

export function getCategoryMeta(id: string) {
  return CATEGORY_MAP.get(id) || { id, label: id, icon: '\uD83D\uDCCC' };
}
