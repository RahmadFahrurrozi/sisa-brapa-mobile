import { api } from '@/services/api';
import { useAuthStore } from '@/stores/authStore';
import { LoginResponse } from '@/types/Auth';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import React from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

// 1. Skema validasi Zod untuk Register
export const registerSchema = z.object({
  name: z.string().min(1, 'Nama lengkap wajib diisi'),
  email: z
    .string()
    .min(1, 'Email wajib diisi')
    .email('Format email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
});

export type RegisterFormData = z.infer<typeof registerSchema>;

export function useRegisterForm() {
  const { login: saveAuthToStore } = useAuthStore();
  const [apiError, setApiError] = React.useState<string | null>(null);
  const [isSuccess, setIsSuccess] = React.useState(false);

  // 2. Setup react-hook-form
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  // 3. Fungsi submit register
  const onSubmit = handleSubmit(async (data: RegisterFormData) => {
    setApiError(null);
    setIsSuccess(false);
    try {
      // Kirim data register ke backend
      await api.post('/auth/register', {
        name: data.name,
        email: data.email,
        password: data.password,
      });

      setIsSuccess(true);

      // Langsung login secara otomatis menggunakan kredensial yang baru didaftarkan
      const loginResponse = await api.post<LoginResponse>('/auth/login', {
        email: data.email,
        password: data.password,
      });

      const { token, data: user } = loginResponse.data;

      // Simpan auth data ke Zustand store & storage
      await saveAuthToStore(user, token, '');
    } catch (error) {
      if (axios.isAxiosError<{ message: string }>(error)) {
        const errorMessage =
          error.response?.data.message ||
          'Gagal mendaftar. Periksa koneksi Anda.';
        setApiError(errorMessage);
      } else {
        setApiError('Gagal mendaftar. Terjadi kesalahan aplikasi.');
      }
    }
  });

  return {
    control,
    errors,
    isSubmitting,
    apiError,
    isSuccess,
    onSubmit,
  };
}
