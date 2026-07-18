import type { AuthState } from '@/types/Auth';
import { create } from 'zustand';
import { storage } from '../services/storage';

// Definisikan bentuk state dan action yang ada di AuthStore

export const useAuthStore = create<AuthState>((set) => ({
  // State Awal
  user: null,
  isAuthenticated: false,
  isLoading: true, // true saat pertama kali dibuka karena sedang mengecek storage

  // Action: Login
  login: async (user, accessToken, refreshToken) => {
    // Simpan semua data ke Secure Store agar persisten saat app di-restart
    await storage.setAccessToken(accessToken);
    await storage.setRefreshToken(refreshToken);
    await storage.setUser(user);

    // Update status di memory (Zustand state)
    set({
      user,
      isAuthenticated: true,
      isLoading: false,
    });
  },

  // Action: Logout
  logout: async () => {
    // Hapus semua data dari Secure Store
    await storage.clearAuth();

    // Reset state di memory
    set({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  },

  // Action: Hydrate (Dipanggil sekali saat aplikasi pertama kali dibuka)
  hydrate: async () => {
    try {
      const token = await storage.getAccessToken();
      const userData = await storage.getUser();

      if (token && userData) {
        // Jika token dan user ditemukan, otomatis login
        set({
          user: userData,
          isAuthenticated: true,
        });
      } else {
        // Jika tidak ada data, pastikan state-nya logout
        set({
          user: null,
          isAuthenticated: false,
        });
      }
    } catch (error) {
      console.error('Gagal melakukan load auth token:', error);
    } finally {
      // Hentikan status loading setelah pengecekan selesai
      set({ isLoading: false });
    }
  },
}));
