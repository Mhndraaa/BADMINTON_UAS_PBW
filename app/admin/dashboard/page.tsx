'use client';

import { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Users } from 'lucide-react';
import Header from '../../components/Header';
import StatsCard from '../../components/StatsCard';
import BookingCard from '../../components/BookingCard';
import CourtCard from '../../components/CourtCard';
import TabNavigation from '../../components/TabNavigation';
import { Booking, Court } from '../../types';
import { supabase } from '../../supabaseClient';

export default function AdminDashboard() {
  // State untuk menyimpan data booking dari semua user (READ - Membaca data)
  const [bookings, setBookings] = useState<Booking[]>([]);

  // State untuk menyimpan data lapangan (READ - Membaca data)
  const [courts, setCourts] = useState<Court[]>([]);

  // State untuk mengatur tab yang aktif
  const [activeTab, setActiveTab] = useState<'bookings' | 'courts'>('bookings');

  // ===================== CRUD PESANAN =====================
  // READ: Mengambil semua data pesanan dari Supabase
  const fetchBookings = async () => {
    const { data, error } = await supabase
      .from('pesanan')
      .select(`
        id,
        tanggal,
        jam_mulai,
        jam_selesai,
        status_pesanan,
        users:users(nama_lengkap),
        lapangan:lapangan(nomor_lapangan)
      `)
      .order('created_at', { ascending: false });

    if (data) {
      setBookings(
        data.map((item: any) => ({
          id: item.id,
          userName: item.users?.nama_lengkap || '-',
          courtName: item.lapangan?.nomor_lapangan ? `Lapangan ${item.lapangan.nomor_lapangan}` : '-',
          date: item.tanggal,
          time: item.jam_mulai,
          timeEnd: item.jam_selesai,
          duration: item.jam_selesai && item.jam_mulai
            ? (parseInt(item.jam_selesai.split(':')[0]) - parseInt(item.jam_mulai.split(':')[0]))
            : 1,
          status:
            item.status_pesanan === 'menunggu' ? 'pending' :
            item.status_pesanan === 'dikonfirmasi' ? 'confirmed' :
            item.status_pesanan === 'dibatalkan' ? 'cancelled' : 'pending'
        }))
      );
    }
    if (error) {
      console.error('Error fetching bookings:', error.message);
    }
  };

  // CREATE: Admin tidak membuat pesanan, hanya user

  // UPDATE: Admin mengkonfirmasi pesanan user
  const handleConfirmBooking = async (id: string) => {
    const { error } = await supabase
      .from('pesanan')
      .update({ status_pesanan: 'dikonfirmasi' })
      .eq('id', id);
    if (error) {
      alert('Gagal konfirmasi booking: ' + error.message);
      return;
    }
    fetchBookings();
  };

  // UPDATE: Admin menolak pesanan user
  const handleRejectBooking = async (id: string) => {
    const { error } = await supabase
      .from('pesanan')
      .update({ status_pesanan: 'dibatalkan' })
      .eq('id', id);
    if (error) {
      alert('Gagal tolak booking: ' + error.message);
      return;
    }
    fetchBookings();
  };

  // DELETE: (opsional, jika diaktifkan) Admin menghapus pesanan user
  // const handleDeleteBooking = async (id: string) => { ... }

  // ===================== CRUD LAPANGAN =====================
  // READ: Mengambil semua data lapangan dari Supabase
  const fetchCourts = async () => {
    const { data, error } = await supabase
      .from('lapangan')
      .select('*');
    if (data) {
      setCourts(
        data.map((item: any) => ({
          id: item.id,
          name: `Lapangan ${item.nomor_lapangan}`,
          status: item.status_lapangan === 'tersedia'
            ? 'available'
            : item.status_lapangan === 'dibooking'
            ? 'booked'
            : 'maintenance'
        }))
      );
    }
    if (error) {
      console.error('Error fetching courts:', error.message);
    }
  };

  // CREATE: Admin menambah lapangan baru
  const handleAddCourt = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const nomor = parseInt((form.nomor as any).value);
    if (!nomor) return alert('Nomor lapangan wajib diisi!');
    const { error } = await supabase.from('lapangan').insert([
      { nomor_lapangan: nomor, status_lapangan: 'tersedia' }
    ]);
    if (error) return alert('Gagal tambah lapangan: ' + error.message);
    form.reset();
    fetchCourts();
  };

  // UPDATE: Admin mengubah status lapangan
  const handleCourtStatusChange = async (id: string, status: Court['status']) => {
    let status_lapangan = 'tersedia';
    if (status === 'booked') status_lapangan = 'dibooking';
    if (status === 'maintenance') status_lapangan = 'maintenance';
    const { error } = await supabase
      .from('lapangan')
      .update({ status_lapangan })
      .eq('id', id);
    if (error) {
      alert('Gagal update status lapangan: ' + error.message);
      return;
    }
    fetchCourts();
  };

  // DELETE: Admin menghapus lapangan
  const handleDeleteCourt = async (id: string) => {
    if (!confirm('Yakin hapus lapangan ini?')) return;
    const { error } = await supabase.from('lapangan').delete().eq('id', id);
    if (error) return alert('Gagal hapus lapangan: ' + error.message);
    fetchCourts();
  };

  useEffect(() => {
    fetchBookings();
    fetchCourts();
  }, []);

  // Fungsi untuk logout
  const handleLogout = () => {
    if (confirm('Apakah Anda yakin ingin logout?')) {
      window.location.href = '/';
    }
  };

  // Menghitung statistik untuk ditampilkan (READ - Membaca data)
  const pendingBookings = bookings.filter(b => b.status === 'pending').length;
  const totalBookings = bookings.length;
  const availableCourts = courts.filter(c => c.status === 'available').length;

  // Data untuk tab navigation
  const tabs = [
    { id: 'bookings', label: 'Daftar Booking' },
    { id: 'courts', label: 'Kelola Lapangan' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Dashboard Admin" showNav={false} onLogout={handleLogout} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* READ - Menampilkan statistik keseluruhan */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatsCard 
            icon={Calendar} 
            title="Total Booking" 
            value={totalBookings} 
            color="text-green-600"
          />
          <StatsCard 
            icon={Clock} 
            title="Menunggu" 
            value={pendingBookings} 
            color="text-yellow-600"
          />
          <StatsCard 
            icon={MapPin} 
            title="Lapangan Tersedia" 
            value={availableCourts} 
            color="text-blue-600"
          />
          <StatsCard 
            icon={Users} 
            title="Total Lapangan" 
            value={courts.length} 
            color="text-purple-600"
          />
        </div>

        {/* Tab untuk mengelola booking dan lapangan */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <TabNavigation 
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={(tabId) => setActiveTab(tabId as 'bookings' | 'courts')}
          />

          <div className="p-6">
            {activeTab === 'bookings' ? (
              <div className="space-y-4">
                {bookings.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">Belum ada booking</p>
                ) : (
                  // READ - Menampilkan semua booking dari user
                  bookings.map((booking) => (
                    <BookingCard
                      key={booking.id}
                      booking={booking}
                      onConfirm={handleConfirmBooking} // UPDATE - Konfirmasi booking
                      onReject={handleRejectBooking}   // UPDATE - Tolak booking
                      isAdmin={true}
                    />
                  ))
                )}
              </div>
            ) : (
              <>
                <form className="mb-4 flex gap-2 bg-white border border-gray-200 rounded-lg shadow p-4" onSubmit={handleAddCourt}>
                  <input
                    name="nomor"
                    type="number"
                    min={1}
                    placeholder="Nomor Lapangan"
                    className="border px-2 py-1 rounded"
                    required
                  />
                  <button
                    type="submit"
                    className="bg-green-600 text-white px-4 py-1 rounded"
                  >
                    Tambah Lapangan
                  </button>
                </form>
                <div className="space-y-4">
                  {courts.map((court) => (
                    <div key={court.id} className="flex items-center gap-2">
                      <CourtCard
                        court={court}
                        onStatusChange={handleCourtStatusChange}
                      />
                      <button
                        onClick={() => handleDeleteCourt(court.id)}
                        className="text-red-600 hover:text-red-800 border border-red-200 rounded px-2 py-1"
                      >
                        Hapus
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
} 