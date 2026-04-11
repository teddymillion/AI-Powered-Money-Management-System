import type { Lang } from './i18n';

export interface CategoryItem {
  id: string;
  label: { en: string; am: string };
  icon: string;
  type?: 'income' | 'expense';
}

export const CATEGORIES: CategoryItem[] = [
  { id: 'salary',        label: { en: 'Salary', am: 'ደመወዝ' },                    icon: '💰', type: 'income' },
  { id: 'freelance',     label: { en: 'Freelance', am: 'ነፃ ስራ' },                icon: '💻', type: 'income' },
  { id: 'food',          label: { en: 'Food & Dining', am: 'ምግብ' },             icon: '🍽️', type: 'expense' },
  { id: 'transport',     label: { en: 'Transport', am: 'ትራንስፖርት' },            icon: '🚗', type: 'expense' },
  { id: 'rent',          label: { en: 'Rent & Housing', am: 'ቤት ኪራይ' },        icon: '🏠', type: 'expense' },
  { id: 'utilities',     label: { en: 'Utilities', am: 'ውሃ ብርሃን' },             icon: '💡', type: 'expense' },
  { id: 'shopping',      label: { en: 'Shopping', am: 'ግዢ' },                    icon: '🛒', type: 'expense' },
  { id: 'entertainment', label: { en: 'Entertainment', am: 'መዝናኛ' },            icon: '🎬', type: 'expense' },
  { id: 'healthcare',    label: { en: 'Healthcare', am: 'ጤና' },                 icon: '🏥', type: 'expense' },
  { id: 'education',     label: { en: 'Education', am: 'ትምህርት' },              icon: '📚', type: 'expense' },
  { id: 'savings',       label: { en: 'Savings', am: 'ቁጠባ' },                   icon: '💰', type: 'income' },
  { id: 'other',         label: { en: 'Other', am: 'ሌላ' },                      icon: '📌' },
];

export const CATEGORY_MAP = new Map(CATEGORIES.map((item) => [item.id, item]));

export function getCategoryMeta(id: string, lang: Lang = 'en') {
  const cat = CATEGORY_MAP.get(id) || { id, label: { en: id, am: id }, icon: '📌' };
  return { ...cat, label: cat.label[lang] };
}
