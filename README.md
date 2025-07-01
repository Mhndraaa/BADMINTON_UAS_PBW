# Website Pemesanan Lapangan Bulu Tangkis

Website sederhana untuk pemesanan lapangan bulu tangkis yang dibangun dengan Next.js, TypeScript, dan Tailwind CSS.

## Fitur

### 🏠 Landing Page
- Halaman utama yang menarik dengan informasi layanan
- Navigasi ke halaman login dan register

### 👤 User Features
- **Login/Register**: Sistem autentikasi untuk user dan admin
- **Dashboard User**: 
  - Melihat statistik booking (total, aktif, menunggu)
  - Daftar booking pribadi
  - Membuat booking baru
  - Membatalkan booking yang masih pending

### 🔧 Admin Features
- **Dashboard Admin**:
  - Melihat statistik keseluruhan
  - Mengelola semua booking dari user
  - Konfirmasi/tolak booking
  - Mengelola status lapangan (tersedia/dibooking/maintenance)

## Teknologi yang Digunakan

- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **React Hooks** - State management

## Struktur Proyek

```
app/
├── components/          # Reusable components
│   ├── Header.tsx      # Header component
│   ├── StatsCard.tsx   # Statistics card
│   ├── StatusBadge.tsx # Status badge
│   ├── BookingCard.tsx # Booking card
│   ├── BookingForm.tsx # Booking form modal
│   ├── CourtCard.tsx   # Court management card
│   └── TabNavigation.tsx # Tab navigation
├── types/              # TypeScript interfaces
│   └── index.ts        # Type definitions
├── login/              # Login page
├── register/           # Register page
├── dashboard/          # User dashboard
├── admin/              # Admin dashboard
│   └── dashboard/
└── page.tsx            # Landing page
```

## Komponen yang Dibuat

### 1. Header Component
- Komponen header yang dapat digunakan kembali
- Mendukung navigasi dan logout button
- Props: `title`, `showNav`, `onLogout`

### 2. StatsCard Component
- Menampilkan statistik dengan icon dan warna yang dapat dikustomisasi
- Props: `icon`, `title`, `value`, `color`

### 3. StatusBadge Component
- Badge untuk menampilkan status dengan warna yang sesuai
- Props: `status`, `size`

### 4. BookingCard Component
- Card untuk menampilkan informasi booking
- Mendukung aksi untuk user dan admin
- Props: `booking`, `onCancel`, `onConfirm`, `onReject`, `showActions`, `isAdmin`

### 5. BookingForm Component
- Modal form untuk membuat booking baru
- Props: `onSubmit`, `onCancel`

### 6. CourtCard Component
- Card untuk mengelola status lapangan
- Props: `court`, `onStatusChange`

### 7. TabNavigation Component
- Navigasi tab yang dapat digunakan kembali
- Props: `tabs`, `activeTab`, `onTabChange`

## Cara Menjalankan

1. Install dependencies:
```bash
npm install
```

2. Jalankan development server:
```bash
npm run dev
```

3. Buka [http://localhost:3000](http://localhost:3000) di browser

## Fitur CRUD

### Create (Membuat)
- ✅ User dapat membuat booking baru
- ✅ Admin dapat melihat semua booking

### Read (Membaca)
- ✅ User melihat daftar booking pribadi
- ✅ Admin melihat semua booking dan status lapangan

### Update (Mengubah)
- ✅ User dapat membatalkan booking
- ✅ Admin dapat konfirmasi/tolak booking
- ✅ Admin dapat mengubah status lapangan

### Delete (Menghapus)
- ✅ Soft delete (mengubah status menjadi cancelled)

## Catatan

- Aplikasi ini menggunakan state lokal (local state) tanpa database
- Data akan hilang saat refresh halaman
- Login/logout masih simulasi
- Untuk production, perlu ditambahkan:
  - Database integration
  - Authentication system yang robust
  - Data persistence
  - Real-time updates

## Lisensi

MIT License
