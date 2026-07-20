import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import 'react-native-reanimated';
import '../global.css';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuthStore } from '@/stores/authStore';

export const unstable_settings = {
  anchor: '(tabs)',
};

// Kita pecah menjadi sub-komponen navigasi agar bisa menggunakan hook Expo Router (useRouter, useSegments)
function RootLayoutNav() {
  const { isAuthenticated, isLoading, hydrate } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();

  // 1. Jalankan pengecekan token (hydrate) sekali saja saat aplikasi dibuka
  useEffect(() => {
    hydrate();
  }, [hydrate]);

  // 2. Auth Guard: Pantau status login dan rute yang sedang diakses
  useEffect(() => {
    if (isLoading) return; // Jangan lakukan apa-apa selagi masih mengecek storage

    const inAuthGroup = segments[0] === '(auth)';

    if (!isAuthenticated && !inAuthGroup) {
      // Bungkus dengan setTimeout untuk menunda navigasi sampai navigator selesai dimount
      const timer = setTimeout(() => {
        router.replace('/login');
      }, 1);
      return () => clearTimeout(timer);
    } else if (isAuthenticated && inAuthGroup) {
      // Bungkus dengan setTimeout juga
      const timer = setTimeout(() => {
        router.replace('/');
      }, 1);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, isLoading, segments, router]);

  // Jika sedang mengecek token, tampilkan loading screen sederhana
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <Stack>
      {/* Halaman utama (dashboard) */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      {/* Grup halaman auth login/register */}
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      {/* Detail & Pencatatan Transaksi */}
      <Stack.Screen name="expense/new" options={{ headerShown: false }} />
      <Stack.Screen name="expense/[id]" options={{ headerShown: false }} />
      {/* Modal */}
      <Stack.Screen
        name="modal"
        options={{ presentation: 'modal', title: 'Modal' }}
      />
    </Stack>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <RootLayoutNav />
      <StatusBar style="inverted" />
    </ThemeProvider>
  );
}
