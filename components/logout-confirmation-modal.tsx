import React from 'react';
import { Modal, Text, TouchableOpacity, View } from 'react-native';

interface LogoutConfirmationModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function LogoutConfirmationModal({
  visible,
  onClose,
  onConfirm,
}: LogoutConfirmationModalProps) {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}>
      <View className="flex-1 items-center justify-center bg-black/45 px-6">
        {/* Card Modal */}
        <View className="w-full max-w-[320px] rounded-[12px] border border-[#ebebeb] bg-white p-6 shadow-lg">
          <Text className="text-lg font-bold tracking-tight text-[#171717]">
            Keluar dari Aplikasi?
          </Text>
          <Text className="mt-2 text-sm leading-5 text-[#888888]">
            Apakah Anda yakin ingin keluar dari akun Anda? Anda harus masuk
            kembali nanti.
          </Text>

          {/* Tombol Aksi */}
          <View className="mt-6 flex-row gap-3">
            {/* Batal */}
            <TouchableOpacity
              onPress={onClose}
              className="h-[44px] flex-1 items-center justify-center rounded-[6px] border border-[#ebebeb] bg-white active:bg-gray-50">
              <Text className="text-sm font-semibold text-[#171717]">
                Batal
              </Text>
            </TouchableOpacity>

            {/* Keluar */}
            <TouchableOpacity
              onPress={onConfirm}
              className="h-[44px] flex-1 items-center justify-center rounded-[6px] bg-[#7928ca] active:opacity-90">
              <Text className="text-sm font-semibold text-white">Keluar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
