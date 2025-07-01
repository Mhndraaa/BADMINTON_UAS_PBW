'use client';

import { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Plus } from 'lucide-react';
import Header from '../components/Header';
import StatsCard from '../components/StatsCard';
import BookingCard from '../components/BookingCard';
import BookingForm from '../components/BookingForm';
import { Booking, BookingFormData } from '../types';
import { supabase } from '../supabaseClient';

export default function Dashboard() {
  // State untuk menyimpan data booking (READ - Membaca data)
  const [bookings, setBookings] = useState<Booking[]>([]);

  // State untuk menampilkan/menyembunyikan form booking
  const [showBookingForm, setShowBookingForm] = useState(false);

  // Fungsi untuk fetch data booking dari Supabase
  const fetchBookings = async () => {
    // Ambil user yang sedang login
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Ambil pesanan milik user ini
    const { data, error } = await supabase
      .from('pesanan')
      .select(`
        id,
        tanggal,
        jam_mulai,
        jam_selesai,
        status_pesanan,
        lapangan:lapangan(nomor_lapangan)
      `)
      .eq('id_user', user.id)
      .order('created_at', { ascending: false });

    if (data) {
      setBookings(
        data.map((item: any) => ({
          id: item.id,
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

  useEffect(() => {
    fetchBookings();
  }, []);

  // Fungsi untuk logout
  const handleLogout = () => {
    if (confirm('Apakah Anda yakin ingin logout?')) {
      window.location.href = '/';
    }
  };

  // CREATE - Membuat booking baru
  const handleBookingSubmit = async (data: BookingFormData) => {
    // Ambil user yang sedang login
    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;
    if (!user) {
      alert('Anda harus login!');
      return;
    }

    // Ambil id_lapangan dari nomor lapangan (apapun format courtName)
    const nomorLapangan = parseInt(data.courtName.replace(/\D/g, ''));
    const { data: lapanganData } = await supabase
      .from('lapangan')
      .select('id')
      .eq('nomor_lapangan', nomorLapangan)
      .single();

    if (!lapanganData) {
      alert(`Lapangan dengan nomor ${nomorLapangan} tidak ditemukan!`);
      return;
    }

    // Insert ke tabel pesanan
    const { error } = await supabase.from('pesanan').insert([{
      id_lapangan: lapanganData.id,
      id_user: user.id,
      tanggal: data.date,
      jam_mulai: data.time,
      jam_selesai: data.timeEnd,
      durasi: `${data.duration} hour`,
      status_pesanan: 'menunggu'
    }]);

    if (error) {
      alert('Gagal membuat booking: ' + error.message);
      return;
    }

    setShowBookingForm(false);
    // Refresh data booking dari Supabase
    fetchBookings();
  };

  // UPDATE - Mengubah status booking menjadi cancelled (soft delete)
  const handleCancelBooking = (id: string) => {
    if (confirm('Apakah Anda yakin ingin membatalkan booking ini?')) {
      setBookings(bookings.map(booking => 
        booking.id === id ? { ...booking, status: 'cancelled' as const } : booking
      ));
    }
  };

  // Menghitung statistik untuk ditampilkan (READ - Membaca data)
  const confirmedBookings = bookings.filter(b => b.status === 'confirmed').length;
  const pendingBookings = bookings.filter(b => b.status === 'pending').length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Dashboard User" showNav={false} onLogout={handleLogout} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* READ - Menampilkan statistik booking */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatsCard 
            icon={Calendar} 
            title="Total Booking" 
            value={bookings.length} 
            color="text-green-600"
          />
          <StatsCard 
            icon={Clock} 
            title="Aktif" 
            value={confirmedBookings} 
            color="text-blue-600"
          />
          <StatsCard 
            icon={MapPin} 
            title="Menunggu" 
            value={pendingBookings} 
            color="text-yellow-600"
          />
        </div>

        {/* READ - Menampilkan daftar booking */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">Daftar Booking</h2>
              {/* CREATE - Tombol untuk membuat booking baru */}
              <button
                onClick={() => setShowBookingForm(true)}
                className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>Booking Baru</span>
              </button>
            </div>
          </div>

          <div className="p-6">
            {bookings.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Belum ada booking</p>
            ) : (
              <div className="space-y-4">
                {/* READ - Menampilkan setiap booking */}
                {bookings.map((booking) => (
                  <BookingCard
                    key={booking.id}
                    booking={booking}
                    onCancel={handleCancelBooking} // UPDATE - Fungsi untuk membatalkan booking
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* CREATE - Modal form untuk membuat booking baru */}
      {showBookingForm && (
        <BookingForm
          onSubmit={handleBookingSubmit}
          onCancel={() => setShowBookingForm(false)}
        />
      )}
    </div>
  );
} 