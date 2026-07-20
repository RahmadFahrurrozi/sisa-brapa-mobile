export const CATEGORIES = [
  'food',
  'transport',
  'entertainment',
  'health',
  'other',
] as const;

export type ExpenseCategory = (typeof CATEGORIES)[number];

export interface CategoryDetail {
  label: string;
  icon: string;
  bgColor: string;
  iconColor: string;
}

export const CATEGORY_DETAILS: Record<ExpenseCategory, CategoryDetail> = {
  food: {
    label: 'Makanan',
    icon: 'fast-food-outline',
    bgColor: '#f3e8ff',
    iconColor: '#9d53f2',
  },
  transport: {
    label: 'Transportasi',
    icon: 'car-outline',
    bgColor: '#ebe0ff',
    iconColor: '#7928ca',
  },
  entertainment: {
    label: 'Hiburan',
    icon: 'film-outline',
    bgColor: '#f5f0ff',
    iconColor: '#9d53f2',
  },
  health: {
    label: 'Kesehatan',
    icon: 'heart-outline',
    bgColor: '#ebe0ff',
    iconColor: '#6d1fb5',
  },
  other: {
    label: 'Lainnya',
    icon: 'ellipsis-horizontal-outline',
    bgColor: '#f3e8ff',
    iconColor: '#7928ca',
  },
};
