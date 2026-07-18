import { User } from '@/types/User';
import * as SecureStore from 'expo-secure-store';

const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const USER_KEY = 'user_data'; // Tambahkan key baru untuk data user

export const storage = {
  // save access token
  async setAccessToken(token: string) {
    await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, token);
  },

  // get access token
  async getAccessToken(): Promise<string | null> {
    // gunakan lowercase string
    return await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
  },

  // delete access token
  async deleteAccessToken(): Promise<void> {
    await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
  },

  // save refresh token
  async setRefreshToken(token: string) {
    await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, token);
  },

  // get refresh token
  async getRefreshToken(): Promise<string | null> {
    // gunakan lowercase string
    return await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
  },

  async deleteRefreshToken(): Promise<void> {
    await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
  },

  // --- HELPER DATA USER ---
  // Menyimpan data profil user (object diganti ke string JSON)
  async setUser(user: User): Promise<void> {
    await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
  },

  // Mengambil data profil user (di-parse kembali ke object)
  async getUser(): Promise<User | null> {
    const data = await SecureStore.getItemAsync(USER_KEY);
    return data ? JSON.parse(data) : null;
  },

  // Menghapus data profil user
  async deleteUser(): Promise<void> {
    await SecureStore.deleteItemAsync(USER_KEY);
  },

  // --- CLEAN UP ---
  // delete all token and user data for logout
  async clearAuth(): Promise<void> {
    await Promise.all([
      SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY),
      SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY),
      SecureStore.deleteItemAsync(USER_KEY), // hapus data user juga saat logout
    ]);
  },
};
