import { useExpenseForm } from '@/hooks/use-expense-form';
import { CATEGORY_DETAILS, CATEGORIES } from '@/constants/categories';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Controller } from 'react-hook-form';
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function NewExpenseScreen() {
  const router = useRouter();
  const {
    control,
    errors,
    isSubmitting,
    apiError,
    selectedCategory,
    setValue,
    onSubmit,
  } = useExpenseForm();

  return (
    <SafeAreaView className="flex-1 bg-[#ffffff]" edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* Header */}
      <View className="flex-row items-center border-b border-[#ebebeb] px-6 py-4">
        <TouchableOpacity
          onPress={() => router.back()}
          className="mr-4 h-8 w-8 items-center justify-center rounded-full border border-[#ebebeb] bg-white active:bg-gray-50">
          <Ionicons name="arrow-back-outline" size={18} color="#171717" />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-[#171717]">
          Catat Pengeluaran
        </Text>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1">
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            showsVerticalScrollIndicator={false}
            className="px-6 py-6">
            {/* API Error Alert */}
            {apiError ? (
              <View className="mb-5 flex-row items-center rounded-[8px] border border-red-100 bg-red-50 p-4">
                <Ionicons
                  name="alert-circle-outline"
                  size={20}
                  color="#dc2626"
                />
                <Text className="ml-2 flex-1 text-sm font-medium text-red-700">
                  {apiError}
                </Text>
              </View>
            ) : null}

            {/* Input: Judul Transaksi */}
            <View className="mb-5">
              <Text className="mb-2 text-sm font-semibold text-[#171717]">
                Judul Transaksi
              </Text>
              <Controller
                control={control}
                name="title"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    placeholder="Contoh: Makan Siang Nasi Padang"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    className="h-[48px] rounded-[8px] border border-[#ebebeb] bg-white px-4 text-base text-[#171717] focus:border-[#7928ca]"
                    placeholderTextColor="#888888"
                  />
                )}
              />
              {errors.title ? (
                <Text className="mt-1.5 text-xs font-semibold text-red-600">
                  {errors.title.message as string}
                </Text>
              ) : null}
            </View>

            {/* Input: Nominal Uang (Amount) */}
            <View className="mb-5">
              <Text className="mb-2 text-sm font-semibold text-[#171717]">
                Nominal (Rp)
              </Text>
              <Controller
                control={control}
                name="amount"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    placeholder="Contoh: 25000"
                    keyboardType="numeric"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value ? value.toString() : ''}
                    className="h-[48px] rounded-[8px] border border-[#ebebeb] bg-white px-4 text-base text-[#171717] focus:border-[#7928ca]"
                    placeholderTextColor="#888888"
                  />
                )}
              />
              {errors.amount ? (
                <Text className="mt-1.5 text-xs font-semibold text-red-600">
                  {errors.amount.message as string}
                </Text>
              ) : null}
            </View>

            {/* Input: Kategori (Pill Buttons) */}
            <View className="mb-5">
              <Text className="mb-2 text-sm font-semibold text-[#171717]">
                Kategori
              </Text>
              <View className="flex-row flex-wrap gap-2.5">
                {CATEGORIES.map((catKey) => {
                  const cat = CATEGORY_DETAILS[catKey];
                  const isSelected = selectedCategory === catKey;

                  return (
                    <TouchableOpacity
                      key={catKey}
                      onPress={() => setValue('category', catKey)}
                      style={{
                        backgroundColor: isSelected ? '#7928ca' : '#ffffff',
                        borderColor: isSelected ? '#7928ca' : '#ebebeb',
                      }}
                      className="flex-row items-center rounded-full border px-4 py-2.5 active:opacity-85">
                      <Ionicons
                        name={cat.icon as any}
                        size={16}
                        color={isSelected ? '#ffffff' : cat.iconColor}
                      />
                      <Text
                        style={{ color: isSelected ? '#ffffff' : '#171717' }}
                        className="ml-1.5 text-xs font-semibold">
                        {cat.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
              {errors.category ? (
                <Text className="mt-1.5 text-xs font-semibold text-red-600">
                  {errors.category.message as string}
                </Text>
              ) : null}
            </View>

            {/* Input: Catatan Opsional (Note) */}
            <View className="mb-8">
              <Text className="mb-2 text-sm font-semibold text-[#171717]">
                Catatan (Opsional)
              </Text>
              <Controller
                control={control}
                name="note"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    placeholder="Tulis catatan tambahan di sini..."
                    multiline
                    numberOfLines={4}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    style={{ textAlignVertical: 'top' }}
                    className="h-[100px] rounded-[8px] border border-[#ebebeb] bg-white p-4 text-base text-[#171717] focus:border-[#7928ca]"
                    placeholderTextColor="#888888"
                  />
                )}
              />
              {errors.note ? (
                <Text className="mt-1.5 text-xs font-semibold text-red-600">
                  {errors.note.message as string}
                </Text>
              ) : null}
            </View>

            {/* Tombol Simpan */}
            <TouchableOpacity
              onPress={onSubmit}
              disabled={isSubmitting}
              className="mt-auto h-[48px] items-center justify-center rounded-[8px] bg-[#7928ca] active:opacity-90">
              {isSubmitting ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <Text className="text-base font-bold text-white">
                  Simpan Transaksi
                </Text>
              )}
            </TouchableOpacity>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
