import { api } from '@/services/api';
import { useAuthStore } from '@/stores/authStore';
import { LoginResponse } from '@/types/Auth';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

export const loginSchema = z.object({
  email: z.string().min(1, 'Email must be required'),
  password: z.string().min(6, 'Password min 6 character'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export function useLoginForm() {
  const { login: saveAuthToStore } = useAuthStore();
  const [apiError, setApiError] = useState<string | null>(null);

  // 2. Inisialisasi React Hook Form
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = handleSubmit(async (data: LoginFormData) => {
    setApiError(null);
    try {
      const response = await api.post<LoginResponse>('/auth/login', {
        email: data.email,
        password: data.password,
      });

      const { token, data: user } = response.data;

      const refreshToken = '';

      await saveAuthToStore(user, token, refreshToken);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data.message || 'Gagal login. Periksa koneksi Anda.';
        setApiError(errorMessage);
      } else {
        setApiError('Gagal login. Terjadi kesalahan aplikasi.');
      }
    }
  });

  return {
    control,
    errors,
    isSubmitting,
    apiError,
    onSubmit,
  };
}
