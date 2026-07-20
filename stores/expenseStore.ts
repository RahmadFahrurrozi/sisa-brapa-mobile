import { api } from '@/services/api';
import type {
  Expense,
  ExpenseCategory,
  ExpenseDetailResponse,
  ExpensesResponse,
  ExpenseSummaryData,
  ExpenseSummaryResponse,
  PaginationMetadata,
} from '@/types/Expense';
import { create } from 'zustand';

interface ExpenseFilters {
  limit?: number;
  category?: ExpenseCategory;
  month?: number;
  year?: number;
  search?: string;
}

interface ExpenseState {
  expenses: Expense[];
  summary: ExpenseSummaryData;
  pagination: PaginationMetadata | null;
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;

  fetchExpenses: (
    page?: number,
    filters?: ExpenseFilters,
    append?: boolean,
  ) => Promise<void>;
  fetchSummary: (month?: number, year?: number) => Promise<void>;
  addExpense: (
    title: string,
    amount: number,
    category: ExpenseCategory,
    date?: string,
    note?: string,
  ) => Promise<Expense>;
  updateExpense: (
    id: string,
    data: {
      title?: string;
      amount?: number;
      category?: ExpenseCategory;
      date?: string;
      note?: string | null;
    },
  ) => Promise<Expense>;
  deleteExpense: (id: string) => Promise<void>;
  clearError: () => void;
  reset: () => void;
}

const initialSummary: ExpenseSummaryData = {
  period: {
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  },
  summary: {
    food: { total: 0, count: 0 },
    transport: { total: 0, count: 0 },
    entertainment: { total: 0, count: 0 },
    health: { total: 0, count: 0 },
    other: { total: 0, count: 0 },
  },
  grandTotal: 0,
};

export const useExpenseStore = create<ExpenseState>((set, get) => ({
  // State Awal
  expenses: [],
  summary: initialSummary,
  pagination: null,
  isLoading: false,
  isSubmitting: false,
  error: null,

  clearError: () => set({ error: null }),

  reset: () =>
    set({
      expenses: [],
      summary: initialSummary,
      pagination: null,
      isLoading: false,
      isSubmitting: false,
      error: null,
    }),

  // Action: Ambil daftar pengeluaran
  fetchExpenses: async (page = 1, filters = {}, append = false) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get<ExpensesResponse>('/expenses', {
        params: {
          page,
          limit: filters.limit ?? 10,
          category: filters.category,
          month: filters.month,
          year: filters.year,
          search: filters.search,
        },
      });

      const { data, pagination } = response.data;

      set({
        expenses: append ? [...get().expenses, ...data] : data,
        pagination,
        isLoading: false,
      });
    } catch (err: any) {
      const errMsg =
        err.response?.data?.message || 'Gagal mengambil data pengeluaran';
      set({ error: errMsg, isLoading: false });
    }
  },

  // Action: Ambil ringkasan bulanan per kategori
  fetchSummary: async (month, year) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get<ExpenseSummaryResponse>(
        '/expenses/summary',
        {
          params: { month, year },
        },
      );

      set({
        summary: response.data.data,
        isLoading: false,
      });
    } catch (err: any) {
      const errMsg =
        err.response?.data?.message || 'Gagal mengambil ringkasan pengeluaran';
      set({ error: errMsg, isLoading: false });
    }
  },

  // Action: Tambah pengeluaran baru
  addExpense: async (title, amount, category, date, note) => {
    set({ isSubmitting: true, error: null });
    try {
      const response = await api.post<ExpenseDetailResponse>('/expenses', {
        title,
        amount,
        category,
        date: date || new Date().toISOString(),
        note: note || undefined,
      });

      const newExpense = response.data.data;

      // Update state local expenses
      set((state) => ({
        expenses: [newExpense, ...state.expenses],
        isSubmitting: false,
      }));

      // Refetch summary agar data dashboard sinkron
      const currentMonth = date
        ? new Date(date).getMonth() + 1
        : new Date().getMonth() + 1;
      const currentYear = date
        ? new Date(date).getFullYear()
        : new Date().getFullYear();
      get().fetchSummary(currentMonth, currentYear);

      return newExpense;
    } catch (err: any) {
      const errMsg =
        err.response?.data?.message || 'Gagal menambahkan pengeluaran';
      set({ error: errMsg, isSubmitting: false });
      throw new Error(errMsg);
    }
  },

  // Action: Edit pengeluaran berdasarkan ID
  updateExpense: async (id, updatedData) => {
    set({ isSubmitting: true, error: null });
    try {
      const response = await api.put<ExpenseDetailResponse>(
        `/expenses/${id}`,
        updatedData,
      );

      const editedExpense = response.data.data;

      // Update di state local
      set((state) => ({
        expenses: state.expenses.map((exp) =>
          exp.id === id ? editedExpense : exp,
        ),
        isSubmitting: false,
      }));

      // Refetch summary agar data dashboard sinkron
      const dateVal = editedExpense.date;
      const currentMonth = new Date(dateVal).getMonth() + 1;
      const currentYear = new Date(dateVal).getFullYear();
      get().fetchSummary(currentMonth, currentYear);

      return editedExpense;
    } catch (err: any) {
      const errMsg =
        err.response?.data?.message || 'Gagal mengubah data pengeluaran';
      set({ error: errMsg, isSubmitting: false });
      throw new Error(errMsg);
    }
  },

  // Action: Hapus pengeluaran
  deleteExpense: async (id) => {
    set({ isSubmitting: true, error: null });
    try {
      await api.delete(`/expenses/${id}`);

      // Cari item yang dihapus untuk refetch summary bulan terkait
      const deletedItem = get().expenses.find((exp) => exp.id === id);

      // Hapus dari state local
      set((state) => ({
        expenses: state.expenses.filter((exp) => exp.id !== id),
        isSubmitting: false,
      }));

      if (deletedItem) {
        const currentMonth = new Date(deletedItem.date).getMonth() + 1;
        const currentYear = new Date(deletedItem.date).getFullYear();
        get().fetchSummary(currentMonth, currentYear);
      }
    } catch (err: any) {
      const errMsg =
        err.response?.data?.message || 'Gagal menghapus pengeluaran';
      set({ error: errMsg, isSubmitting: false });
      throw new Error(errMsg);
    }
  },
}));
