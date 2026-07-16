# Rencana Pengembangan Mobile App: Expense Tracker dengan Expo (Updated)

Dokumen ini berisi rencana implementasi, peta jalan pembelajaran (_learning roadmap_), arsitektur folder, serta langkah persiapan awal bagi pemula (mulai dari nol) untuk membangun aplikasi mobile menggunakan **Expo (React Native)**.

---

## Deskripsi Rencana

Aplikasi mobile **Expense Tracker** akan dibangun di dalam direktori terpisah pada Desktop agar struktur proyek bersih dan modular (_microservices-like structure_):

- `c:\Users\Acer\Desktop\expense-tracker-api` (Backend API)
- `c:\Users\Acer\Desktop\expense-tracker-mobile` (Aplikasi Mobile - Expo)
- `c:\Users\Acer\Desktop\expense-tracker-web` (Aplikasi Web - Next.js)

---

## Daftar Teknologi & Cara Kerjanya

Dalam pengembangan mobile app ini, kita akan menggunakan tumpukan teknologi modern berikut:

| Teknologi                                          | Peran              | Cara Kerja                                                                                                                                                                                                                         |
| :------------------------------------------------- | :----------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **React Native**                                   | Core Framework     | Menulis aplikasi mobile menggunakan JavaScript/TypeScript. React Native merender UI menggunakan komponen native asli Android/iOS (bukan WebView/HTML biasa).                                                                       |
| **Expo**                                           | Developer Platform | Alat bantu (_tooling_) di atas React Native yang mempermudah proses build, testing, integrasi API device (kamera, storage), dan distribusi aplikasi tanpa perlu mengonfigurasi folder native `android/` atau `ios/` secara manual. |
| **Expo Router**                                    | Routing (Navigasi) | Sistem navigasi berbasis file (_file-based routing_), mirip dengan Next.js App Router. Membuat file di folder `app/` otomatis menjadi sebuah screen/halaman.                                                                       |
| **Expo Go**                                        | Sandbox App        | Aplikasi di Google Play Store / Apple App Store untuk menjalankan hasil kodingan langsung di HP fisik Anda secara real-time via koneksi Wi-Fi / QR Code.                                                                           |
| **Zustand**                                        | State Management   | Mengelola data global aplikasi (seperti data login pengguna, status pengeluaran, tema) agar mudah diakses oleh komponen mana saja.                                                                                                 |
| **Axios**                                          | HTTP Client        | Menembak API backend (mengirim data transaksi, mengambil log pengeluaran, login, dll).                                                                                                                                             |
| **React Native Paper** / **Tailwind (NativeWind)** | UI Framework       | Komponen UI siap pakai yang responsif dan berestetika tinggi sesuai panduan material design/desain modern.                                                                                                                         |

---

## Arsitektur Folder Projek Mobile

Kita akan menginisialisasi proyek di folder `c:\Users\Acer\Desktop\expense-tracker-mobile` dengan struktur sebagai berikut:

```text
expense-tracker-mobile/
│
├── app/                         # Folder Khusus Navigasi & Halaman (Expo Router)
│   ├── (auth)/                  # Grup Halaman Autentikasi (Belum Login)
│   │   ├── login.tsx            # Screen Login
│   │   │   └── register.tsx     # Screen Register
│   │   ├── (tabs)/              # Grup Halaman dengan Navigasi Tab Bawah (Sudah Login)
│   │   │   ├── _layout.tsx      # Konfigurasi Tab Bar (Home, Transaksi, Profile)
│   │   │   ├── index.tsx        # Halaman Home (Dashboard)
│   │   │   ├── transactions.tsx # Halaman Daftar Pengeluaran
│   │   │   └── profile.tsx      # Halaman Pengaturan & Profil
│   │   ├── _layout.tsx          # Root Layout (Mengatur Tema, Provider State, dll)
│   │   └── index.tsx            # Entrypoint (Redirect otomatis ke Login / Home)
│   │
│   ├── src/                     # Folder Logika Pendukung
│   │   ├── components/          # Komponen UI Reusable (Tombol, Card, Input, dll)
│   │   ├── hooks/               # Custom React Hooks (misal: useAuth)
│   │   ├── services/            # Logika API Client (Konfigurasi Axios)
│   │   ├── store/               # State Management (Zustand: authStore, expenseStore)
│   │   └── utils/               # Fungsi Helper (Format Rupiah, Format Tanggal)
│   │
│   ├── assets/                  # Gambar, Logo, dan Font
│   ├── app.json                 # Konfigurasi Utama Expo Project
│   ├── package.json             # Dependensi Aplikasi Mobile
│   └── tsconfig.json            # Konfigurasi TypeScript
```

---

## Keputusan & Persiapan

1.  **Penggunaan Expo Go**: Kita **tidak akan menggunakan Android Studio/Emulator** untuk tahap awal ini karena instalasi Android Studio cukup lama (~1-2 GB untuk software + beberapa GB untuk SDK & emulator) dan sangat memakan RAM. Menggunakan **Expo Go di HP fisik** jauh lebih ringan, cepat, dan instan.
2.  **Pemisahan Folder**: Proyek mobile akan diinisialisasi di folder tersendiri: `c:\Users\Acer\Desktop\expense-tracker-mobile`.
3.  **Fokus Core Features Dahulu**: Fitur onboarding (_splash screen_ / _welcome guide slider_) akan dikesampingkan sementara. Fokus utama kita adalah menyelesaikan fitur inti (_core features_):
    - Registrasi & Login Akun
    - Halaman Dashboard & Input Pengeluaran
    - Sinkronisasi data ke API backend yang sudah dideploy.
      Setelah fitur inti selesai, barulah kita menambahkan kosmetik seperti onboarding/splash screen.

---

## Rencana Langkah Demi Langkah (_Step-by-Step Roadmap_)

### Tahap 1: Inisialisasi Proyek Expo

1.  Membuat direktori baru `c:\Users\Acer\Desktop\expense-tracker-mobile`.
2.  Melakukan inisialisasi Expo dengan TypeScript dan Expo Router di folder tersebut menggunakan `npx create-expo-app`.
3.  Menjalankan perintah start dan menghubungkannya ke HP fisik menggunakan **Expo Go**.

### Tahap 2: Menjelaskan Fondasi Dasar React Native

1.  Membahas perbedaan komponen dasar Web vs Mobile (misal: `View`, `Text`, `Image`, `TouchableOpacity`).
2.  Mempelajari konsep Layout dengan Flexbox di React Native.

### Tahap 3: Konfigurasi Navigasi (Expo Router)

1.  Membuat routing dasar untuk Auth (Stack Navigation) dan Dashboard (Tab Navigation).
2.  Mempersiapkan layout navigasi.

### Tahap 4: Hubungan Backend & State Management

1.  Instalasi **Axios** dan **Zustand**.
2.  Mengaktifkan fitur Login & Register riil yang menembak API backend.

### Tahap 5: Implementasi Fitur Utama

1.  Implementasi fitur CRUD pengeluaran, visualisasi dashboard, dan budget bulanan sesuai endpoint API.

---

## Verification Plan

### Manual Verification

1.  Inisialisasi aplikasi Expo baru di folder `c:\Users\Acer\Desktop\expense-tracker-mobile`.
2.  Menjalankan perintah `npx expo start` di terminal.
3.  Memindai QR Code di HP untuk memastikan aplikasi berjalan dengan baik di HP fisik Anda melalui Expo Go.
