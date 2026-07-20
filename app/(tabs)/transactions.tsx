import { CATEGORY_DETAILS, CATEGORIES } from '@/constants/categories';
import { useExpenseStore } from '@/stores/expenseStore';
import type { ExpenseCategory } from '@/types/Expense';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState, useEffect, useCallback } from 'react';
import {
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TransactionsScreen() {
  const router = useRouter();
  const { expenses, pagination, fetchExpenses, isLoading } = useExpenseStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<
    ExpenseCategory | 'all'
  >('all');
  const [refreshing, setRefreshing] = useState(false);

  // Load data awal berdasarkan filter aktif
  const loadData = useCallback(
    async (page = 1, append = false) => {
      const filters = {
        limit: 10,
        category: selectedCategory === 'all' ? undefined : selectedCategory,
        search: searchQuery || undefined,
      };

      await fetchExpenses(page, filters, append);
    },
    [selectedCategory, searchQuery, fetchExpenses],
  );

  // Trigger loadData saat kategori filter berubah
  useEffect(() => {
    loadData(1, false);
  }, [selectedCategory, loadData]);

  // Handle ketika user selesai mengetik search (opsional: debounced, atau trigger instan)
  // Kita trigger pencarian instan tapi memberi jeda pencarian jika performa butuh.
  // Untuk implementasi instan sederhana, kita trigger fetch saat query search berubah dengan useEffect
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      loadData(1, false);
    }, 400); // Debounce 400ms agar tidak over-fetch saat mengetik

    return () => clearTimeout(delayDebounce);
  }, [searchQuery, loadData]);

  // Pull to refresh handler
  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData(1, false);
    setRefreshing(false);
  };

  // Load halaman berikutnya (infinite scroll)
  const handleLoadMore = () => {
    if (isLoading || !pagination || !pagination.hasNext) return;
    const nextPage = pagination.page + 1;
    loadData(nextPage, true);
  };

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

  // Render loading indicator di bagian bawah saat load halaman baru
  const renderFooter = () => {
    if (!isLoading || !pagination || !pagination.hasNext) return null;
    return (
      <View className="items-center justify-center py-4">
        <ActivityIndicator size="small" color="#7928ca" />
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-[#ffffff]" edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* Header */}
      <View className="border-b border-[#ebebeb] px-6 py-4">
        <Text className="text-xl font-bold tracking-tight text-[#171717]">
          Semua Transaksi
        </Text>
      </View>

      {/* Area Filter & Search */}
      <View className="px-6 pb-2 pt-4">
        {/* Search Input Bar */}
        <View className="mb-4 h-[42px] flex-row items-center rounded-[8px] border border-[#ebebeb] bg-[#fafafa] px-3">
          <Ionicons name="search-outline" size={18} color="#888888" />
          <TextInput
            placeholder="Cari transaksi..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            className="ml-2 flex-1 text-sm text-[#171717]"
            placeholderTextColor="#888888"
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={16} color="#888888" />
            </TouchableOpacity>
          ) : null}
        </View>

        {/* Horizontal Category Filter */}
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={['all', ...CATEGORIES]}
          keyExtractor={(item) => item}
          contentContainerStyle={{ gap: 8, paddingBottom: 6 }}
          renderItem={({ item }) => {
            const isActive = selectedCategory === item;
            const label =
              item === 'all'
                ? 'Semua'
                : CATEGORY_DETAILS[item as ExpenseCategory].label;

            return (
              <TouchableOpacity
                onPress={() =>
                  setSelectedCategory(item as ExpenseCategory | 'all')
                }
                style={{
                  backgroundColor: isActive ? '#7928ca' : '#ffffff',
                  borderColor: isActive ? '#7928ca' : '#ebebeb',
                }}
                className="rounded-full border px-4 py-2 active:opacity-85">
                <Text
                  style={{ color: isActive ? '#ffffff' : '#171717' }}
                  className="text-xs font-semibold">
                  {label}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      {/* Daftar Transaksi */}
      <FlatList
        data={expenses}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingVertical: 12,
          flexGrow: 1,
        }}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.3}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={
          !isLoading ? (
            <View className="flex-1 items-center justify-center py-20">
              <Ionicons name="receipt-outline" size={40} color="#cccccc" />
              <Text className="mt-3 text-sm text-[#888888]">
                Tidak ada transaksi ditemukan
              </Text>
            </View>
          ) : (
            <View className="flex-1 items-center justify-center py-20">
              <ActivityIndicator size="small" color="#7928ca" />
            </View>
          )
        }
        renderItem={({ item }) => {
          const cat =
            CATEGORY_DETAILS[item.category] || CATEGORY_DETAILS['other'];

          return (
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: '/expense/[id]',
                  params: { id: item.id },
                })
              }
              className="flex-row items-center justify-between border-b border-[#ebebeb]/50 bg-white py-4 active:opacity-70"
              activeOpacity={0.6}>
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
                <View className="max-w-[190px]">
                  <Text
                    numberOfLines={1}
                    className="text-sm font-semibold text-[#171717]">
                    {item.title}
                  </Text>
                  <Text className="mt-0.5 text-xs text-[#888888]">
                    {formatDate(item.date)}
                  </Text>
                </View>
              </View>
              <Text className="text-sm font-bold text-[#171717]">
                -{formatCurrency(item.amount)}
              </Text>
            </TouchableOpacity>
          );
        }}
      />
    </SafeAreaView>
  );
}
