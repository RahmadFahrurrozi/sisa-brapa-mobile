import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ExploreScreen() {
  return (
    <SafeAreaView className="flex-1 bg-[#ffffff]" edges={['top']}>
      {/* Header */}
      <View className="border-b border-[#ebebeb] px-6 py-4">
        <Text className="text-xl font-bold tracking-tight text-[#171717]">
          Anggaran & Kategori
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
        className="px-6 py-5">
        <View className="mb-4 h-16 w-16 items-center justify-center rounded-full bg-[#f3e8ff]">
          <Ionicons name="wallet-outline" size={32} color="#7928ca" />
        </View>
        <Text className="text-lg font-bold text-[#171717]">
          Halaman Anggaran
        </Text>
        <Text className="mt-1 px-8 text-center text-sm text-[#888888]">
          Fitur pengaturan budget bulanan dan monitoring kategori belanja kamu
          akan tampil di sini.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
