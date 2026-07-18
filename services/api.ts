import axios from 'axios';
import { storage } from './storage';

// 1. Buat instance Axios kustom
export const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Sangat penting agar HTTP-only cookie (refresh token) terkirim otomatis di mobile
});

// 2. Request Interceptor: Tempelkan Access Token secara otomatis ke header sebelum request dikirim
api.interceptors.request.use(
  async (config) => {
    const token = await storage.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Variabel bantu untuk mengelola antrean request saat proses refresh token sedang berjalan
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (token) {
      prom.resolve(token);
    } else {
      prom.reject(error);
    }
  });
  failedQueue = [];
};

// 3. Response Interceptor: Tangani error 401 (token expired) dengan Silent Refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Jika error status adalah 401 (Unauthorized) dan request tersebut belum pernah di-retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Jika saat ini sedang ada proses refresh token yang berjalan, masukkan request ini ke antrean
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      // Tandai request ini sedang di-retry agar tidak terjadi infinite loop jika refresh-nya gagal
      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Tembak endpoint refresh token.
        // Karena kita set 'withCredentials: true', cookie refresh token dari HP akan otomatis dikirim.
        const response = await api.post('/auth/refresh');
        const newToken = response.data.token; // Mengambil access token baru

        if (newToken) {
          // Simpan access token baru ke secure store
          await storage.setAccessToken(newToken);

          // Update header request awal dengan token baru
          originalRequest.headers.Authorization = `Bearer ${newToken}`;

          // Jalankan semua request lain yang sempat mengantre
          processQueue(null, newToken);

          // Kirim ulang request awal yang sempat gagal tadi
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Jika proses refresh token gagal (misal refresh token di cookie juga sudah expired)
        processQueue(refreshError, null);

        // Hapus token di storage & reset Zustand state (paksa redirect ke login)
        const { useAuthStore } = require('../stores/authStore');
        await useAuthStore.getState().logout();

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Kembalikan error apa adanya jika bukan error 401
    return Promise.reject(error);
  },
);
