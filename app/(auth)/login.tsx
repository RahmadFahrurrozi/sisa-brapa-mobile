import { useLoginForm } from '@/hooks/use-login-form';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import React, { useState } from 'react';
import { Controller } from 'react-hook-form';
import {
  ActivityIndicator,
  Image, // Tambahkan ini
  Keyboard, // Tambahkan ini
  KeyboardAvoidingView, // Tambahkan ini
  Platform, // Tambahkan ini
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity, // Tambahkan ini
  TouchableWithoutFeedback,
  View,
} from 'react-native';

export default function LoginScreen() {
  const { control, errors, isSubmitting, apiError, onSubmit } = useLoginForm();
  const [showPassword, setShowPassword] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 24}
      className="flex-1 bg-white">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
          keyboardShouldPersistTaps="handled"
          className="p-8 px-6">
          {/* Ilustrasi di atas Kartu Form */}
          <View className="mb-2 items-center">
            <Image
              source={require('@/assets/images/login.png')}
              className="h-[180px] w-[270px]"
              resizeMode="contain"
            />
          </View>

          {/* Header */}
          <View className="mb-6">
            <Text className="text-[32px] font-semibold tracking-[-1.28px] text-[#171717]">
              Sisa Brapa
            </Text>
            <Text className="mt-2 text-base text-[#4d4d4d]">
              Masuk untuk mengelola keuangan Anda
            </Text>
          </View>

          {/* Notifikasi Error dari API */}
          {apiError && (
            <View className="mb-5 rounded-[6px] border border-[#ee0000] bg-[#f7d4d6] p-3">
              <Text className="text-sm font-medium text-[#c50000]">
                {apiError}
              </Text>
            </View>
          )}

          {/* Input Email */}
          <View className="mb-5">
            <Text className="mb-2 text-sm font-medium tracking-[-0.28px] text-[#171717]">
              Email
            </Text>
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  className="h-[48px] rounded-[6px] border border-[#ebebeb] bg-white px-4 text-base text-[#171717] focus:border-[#7928ca]"
                  placeholder="nama@email.com"
                  placeholderTextColor="#888888"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
            {errors.email && (
              <Text className="mt-1 text-xs text-[#ee0000]">
                {errors.email.message}
              </Text>
            )}
          </View>

          {/* Input Password */}
          <View className="mb-8">
            <Text className="mb-2 text-sm font-medium tracking-[-0.28px] text-[#171717]">
              Password
            </Text>
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <View
                  className={`h-[48px] flex-row items-center rounded-[6px] border bg-white ${
                    isPasswordFocused ? 'border-[#7928ca]' : 'border-[#ebebeb]'
                  }`}>
                  <TextInput
                    className="h-full flex-1 px-4 text-base text-[#171717]"
                    placeholder="••••••••"
                    placeholderTextColor="#888888"
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    onFocus={() => setIsPasswordFocused(true)}
                    onBlur={() => {
                      onBlur();
                      setIsPasswordFocused(false);
                    }}
                    onChangeText={onChange}
                    value={value}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    className="h-full justify-center px-4">
                    <Ionicons
                      name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                      size={20}
                      color="#888888"
                    />
                  </TouchableOpacity>
                </View>
              )}
            />
            {errors.password && (
              <Text className="mt-1 text-xs text-[#ee0000]">
                {errors.password.message}
              </Text>
            )}
          </View>

          {/* Tombol Masuk */}
          <TouchableOpacity
            className="h-[48px] items-center justify-center rounded-[6px] bg-[#7928ca] active:opacity-90"
            onPress={onSubmit}
            disabled={isSubmitting}>
            {isSubmitting ? (
              <View className="flex-row items-center gap-2">
                <ActivityIndicator color="#ffffff" />
                <Text className="text-base font-medium text-white">
                  Loading...
                </Text>
              </View>
            ) : (
              <Text className="text-base font-medium text-white">Masuk</Text>
            )}
          </TouchableOpacity>

          {/* Navigasi Ke Register */}
          <View className="mt-8 flex-row justify-center">
            <Text className="text-sm text-[#888888]">Belum punya akun? </Text>
            <Link href="/register">
              <Text className="text-sm font-medium text-[#7928ca]">
                Daftar Sekarang
              </Text>
            </Link>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
