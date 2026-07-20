import { LogoutConfirmationModal } from '@/components/logout-confirmation-modal';
import { CATEGORY_DETAILS } from '@/constants/categories';
import { useAuthStore } from '@/stores/authStore';
import { useExpenseStore } from '@/stores/expenseStore';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState, useEffect, useCallback } from 'react';
import {
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { expenses, summary, fetchExpenses, fetchSummary, isLoading } =
    useExpenseStore();

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Ambil data dari server
  const loadData = useCallback(async () => {
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    await Promise.all([
      fetchSummary(month, year),
      fetchExpenses(1, { limit: 5 }),
    ]);
  }, [fetchExpenses, fetchSummary]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Pull to refresh handler
  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  // Hitung total pengeluaran bulan ini dari data summary
  const totalExpenses = summary?.grandTotal || 0;

  // Set default pemasukan/budget (v1 default Rp 5.000.000)
  const totalIncome = 5000000;
  const remainingBalance = totalIncome - totalExpenses;

  // Helper formatting nominal
  const formatCurrency = (value: number) => {
    return `Rp ${value.toLocaleString('id-ID')}`;
  };

  // Helper format tanggal: "19 Jul, 14:20"
  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;

      const day = d.getDate();
      const months = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'Mei',
        'Jun',
        'Jul',
        'Agu',
        'Sep',
        'Okt',
        'Nov',
        'Des',
      ];
      const month = months[d.getMonth()];
      const hours = d.getHours().toString().padStart(2, '0');
      const minutes = d.getMinutes().toString().padStart(2, '0');

      return `${day} ${month}, ${hours}:${minutes}`;
    } catch {
      return dateStr;
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#ffffff]" edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* Header */}
      <View className="flex-row items-center justify-between border-b border-[#ebebeb] px-6 py-4">
        <View>
          <Text className="text-base text-[#888888]">
            Selamat datang kembali,
          </Text>
          <Text className="text-lg font-bold tracking-tight text-[#171717]">
            {user?.name || 'Pengguna'}
          </Text>
        </View>

        {/* Tombol Logout */}
        <TouchableOpacity
          onPress={() => setShowLogoutModal(true)}
          className="h-10 w-10 items-center justify-center rounded-full border border-[#ebebeb] bg-white active:bg-gray-50"
          activeOpacity={0.7}>
          <Ionicons name="log-out-outline" size={20} color="#7928ca" />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#7928ca']}
          />
        }
        className="px-6 py-5">
        {/* Main Balance Card */}
        <View className="relative mb-6 overflow-hidden rounded-[16px] bg-[#7928ca] p-6 shadow-sm">
          <View className="w-[65%]">
            <Text className="text-xs font-semibold uppercase tracking-wider text-white/80">
              Sisa Uang Kamu
            </Text>
            <Text className="mt-1 text-3xl font-bold tracking-tight text-white">
              {formatCurrency(remainingBalance)}
            </Text>
          </View>

          {/* Divider Transparan */}
          <View className="my-4 h-[1px] bg-white/20" />

          {/* Income & Expense Row */}
          <View className="flex-row justify-between">
            {/* Pemasukan */}
            <View className="flex-1">
              <View className="flex-row items-center">
                <Ionicons name="arrow-up-circle" size={16} color="#c084fc" />
                <Text className="ml-1 text-xs text-white/70">Pemasukan</Text>
              </View>
              <Text className="mt-1 text-sm font-semibold text-white">
                {formatCurrency(totalIncome)}
              </Text>
            </View>

            {/* Garis Pembatas Vertikal */}
            <View className="mx-4 w-[1px] bg-white/20" />

            {/* Pengeluaran */}
            <View className="flex-1">
              <View className="flex-row items-center">
                <Ionicons name="arrow-down-circle" size={16} color="#e9d5ff" />
                <Text className="ml-1 text-xs text-white/70">Pengeluaran</Text>
              </View>
              <Text className="mt-1 text-sm font-semibold text-white">
                {formatCurrency(totalExpenses)}
              </Text>
            </View>
          </View>
        </View>

        {/* Quick Actions Menu */}
        <View className="mb-6">
          <Text className="mb-3 text-sm font-semibold tracking-wide text-[#171717]">
            Aksi Cepat
          </Text>
          <View className="flex-row justify-between gap-3">
            {/* Catat Pengeluaran */}
            <TouchableOpacity
              onPress={() => router.push('/expense/new')}
              className="flex-1 items-center rounded-[12px] border border-[#ebebeb] bg-white p-4 active:bg-gray-50">
              <View className="mb-2 h-10 w-10 items-center justify-center rounded-full bg-[#f3e8ff]">
                <Ionicons name="add-circle-outline" size={22} color="#7928ca" />
              </View>
              <Text className="text-center text-xs font-semibold text-[#171717]">
                Catat Uang
              </Text>
            </TouchableOpacity>

            {/* Set Budget */}
            <TouchableOpacity
              onPress={() => router.push('/(tabs)/explore')}
              className="flex-1 items-center rounded-[12px] border border-[#ebebeb] bg-white p-4 active:bg-gray-50">
              <View className="mb-2 h-10 w-10 items-center justify-center rounded-full bg-[#f5f0ff]">
                <Ionicons name="wallet-outline" size={20} color="#9d53f2" />
              </View>
              <Text className="text-center text-xs font-semibold text-[#171717]">
                Atur Budget
              </Text>
            </TouchableOpacity>

            {/* Tabungan */}
            <TouchableOpacity
              onPress={() => {}}
              className="flex-1 items-center rounded-[12px] border border-[#ebebeb] bg-white p-4 active:bg-gray-50">
              <View className="mb-2 h-10 w-10 items-center justify-center rounded-full bg-[#ebe0ff]">
                <Ionicons name="star-outline" size={20} color="#6d1fb5" />
              </View>
              <Text className="text-center text-xs font-semibold text-[#171717]">
                Tabungan
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Transactions Section */}
        <View className="mb-6 flex-1">
          <View className="mb-3 flex-row items-center justify-between">
            <Text className="text-base font-bold tracking-tight text-[#171717]">
              Transaksi Terakhir
            </Text>
            <TouchableOpacity
              onPress={() => router.push('/(tabs)/transactions')}>
              <Text className="text-xs font-semibold text-[#7928ca]">
                Lihat Semua
              </Text>
            </TouchableOpacity>
          </View>

          {/* List Item Transaksi Riil */}
          {isLoading && expenses.length === 0 ? (
            <View className="items-center justify-center py-10">
              <ActivityIndicator size="small" color="#7928ca" />
              <Text className="mt-2 text-xs text-[#888888]">
                Memuat transaksi...
              </Text>
            </View>
          ) : expenses.length === 0 ? (
            <View className="items-center justify-center rounded-[12px] border border-[#ebebeb] bg-white py-10">
              <Ionicons name="receipt-outline" size={28} color="#cccccc" />
              <Text className="mt-2 text-xs text-[#888888]">
                Belum ada transaksi
              </Text>
            </View>
          ) : (
            <View className="gap-3">
              {expenses.slice(0, 5).map((item) => {
                const cat =
                  CATEGORY_DETAILS[item.category] || CATEGORY_DETAILS['other'];
                return (
                  <TouchableOpacity
                    key={item.id}
                    onPress={() =>
                      router.push({
                        pathname: '/expense/[id]',
                        params: { id: item.id },
                      })
                    }
                    className="flex-row items-center justify-between rounded-[12px] border border-[#ebebeb] bg-white p-4 active:bg-gray-50"
                    activeOpacity={0.7}>
                    <View className="flex-row items-center">
                      <View
                        style={{ backgroundColor: cat.bgColor }}
                        className="mr-3 h-10 w-10 items-center justify-center rounded-full">
                        <Ionicons
                          name={cat.icon as any}
                          size={20}
                          color={cat.iconColor}
                        />
                      </View>
                      <View className="max-w-[180px]">
                        <Text
                          numberOfLines={1}
                          className="text-sm font-semibold text-[#171717]">
                          {item.title}
                        </Text>
                        <Text className="text-xs text-[#888888]">
                          {formatDate(item.date)}
                        </Text>
                      </View>
                    </View>
                    <Text className="text-sm font-bold text-[#171717]">
                      -{formatCurrency(item.amount)}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Pop Up Confirmation Logout */}
      <LogoutConfirmationModal
        visible={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={logout}
      />
    </SafeAreaView>
  );
}
