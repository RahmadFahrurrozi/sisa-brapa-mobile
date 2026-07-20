import { Tabs } from 'expo-router';
import React from 'react';
import { View, Platform } from 'react-native';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#7928ca', // Paksa warna aktif ungu Violet
        tabBarInactiveTintColor: '#888888', // Warna inaktif abu-abu
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: '#ffffff', // Background putih bersih
          borderTopWidth: 1,
          borderTopColor: '#ebebeb', // Border tipis abu-abu di atas
          height: Platform.OS === 'ios' ? 88 : 64,
          paddingTop: 8,
          paddingBottom: Platform.OS === 'ios' ? 28 : 10,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, focused }) => (
            <View className="relative w-full items-center justify-center">
              {focused && (
                <View className="absolute -top-[8px] h-[3px] w-[32px] rounded-full bg-[#7928ca]" />
              )}
              <IconSymbol size={24} name="house.fill" color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="transactions"
        options={{
          title: 'Transaksi',
          tabBarIcon: ({ color, focused }) => (
            <View className="relative w-full items-center justify-center">
              {focused && (
                <View className="absolute -top-[8px] h-[3px] w-[32px] rounded-full bg-[#7928ca]" />
              )}
              <IconSymbol size={24} name="creditcard.fill" color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Anggaran',
          tabBarIcon: ({ color, focused }) => (
            <View className="relative w-full items-center justify-center">
              {focused && (
                <View className="absolute -top-[8px] h-[3px] w-[32px] rounded-full bg-[#7928ca]" />
              )}
              <IconSymbol size={24} name="wallet.fill" color={color} />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}
