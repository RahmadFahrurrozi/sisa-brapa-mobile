export type ExpenseCategory =
  'food' | 'transport' | 'entertainment' | 'health' | 'other';

export interface Expense {
  id: string;
  userId: string;
  title: string;
  amount: number;
  category: ExpenseCategory;
  date: string;
  note: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationMetadata {
  page: number;
  limit: number;
  totalData: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface ExpensesResponse {
  status: number;
  message: string;
  data: Expense[];
  pagination: PaginationMetadata;
}

export interface ExpenseDetailResponse {
  status: number;
  message: string;
  data: Expense;
}

export interface CategorySummary {
  total: number;
  count: number;
}

export interface ExpenseSummaryData {
  period: {
    month: number;
    year: number;
  };
  summary: Record<ExpenseCategory, CategorySummary>;
  grandTotal: number;
}

export interface ExpenseSummaryResponse {
  status: number;
  message: string;
  data: ExpenseSummaryData;
}
