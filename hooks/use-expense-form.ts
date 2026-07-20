import { useExpenseStore } from '@/stores/expenseStore';
import type { ExpenseCategory } from '@/types/Expense';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

export const expenseSchema = z.object({
  title: z
    .string()
    .min(1, 'Judul wajib diisi')
    .max(50, 'Judul maksimal 50 karakter'),
  amount: z.coerce
    .number({ message: 'Nominal harus berupa angka' })
    .min(100, 'Nominal minimal Rp 100'),
  category: z.enum(['food', 'transport', 'entertainment', 'health', 'other'], {
    message: 'Pilih salah satu kategori',
  }),
  note: z.string().optional(),
  date: z.string().optional(),
});

export type ExpenseFormData = z.infer<typeof expenseSchema>;

export function useExpenseForm(expenseId?: string) {
  const router = useRouter();
  const { addExpense, updateExpense, expenses } = useExpenseStore();
  const [apiError, setApiError] = useState<string | null>(null);

  // Jika expenseId disediakan (edit mode), cari data expense yang ada
  const existingExpense = expenseId
    ? expenses.find((e) => e.id === expenseId)
    : null;

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<any>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      title: existingExpense?.title || '',
      amount: existingExpense?.amount || undefined,
      category: existingExpense?.category || 'food',
      note: existingExpense?.note || '',
      date: existingExpense?.date || new Date().toISOString(),
    },
  });

  const selectedCategory = watch('category');

  const onSubmit = handleSubmit(async (data: any) => {
    setApiError(null);
    try {
      if (expenseId) {
        // Edit mode
        await updateExpense(expenseId, {
          title: data.title,
          amount: data.amount,
          category: data.category,
          note: data.note || null,
          date: data.date,
        });
      } else {
        // Create mode
        await addExpense(
          data.title,
          data.amount,
          data.category,
          data.date,
          data.note,
        );
      }
      // Kembali ke halaman sebelumnya
      router.back();
    } catch (err: any) {
      setApiError(err.message || 'Terjadi kesalahan saat menyimpan data');
    }
  });

  return {
    control,
    errors,
    isSubmitting,
    apiError,
    selectedCategory,
    setValue,
    onSubmit,
    isEditMode: !!expenseId,
    existingExpense,
  };
}
