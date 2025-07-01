'use client';

import { useState, useEffect } from 'react';
import { BookingFormData } from '../types';
import { supabase } from '../supabaseClient';

interface BookingFormProps {
  onSubmit: (data: BookingFormData) => void; // CREATE - Fungsi untuk membuat booking baru
  onCancel: () => void;
}

const HOURS = [
  '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00',
  '20:00', '21:00', '22:00'
];

export default function BookingForm({ onSubmit, onCancel }: BookingFormProps) {
  // State untuk menyimpan data form booking (CREATE - Persiapan data)
  const [formData, setFormData] = useState<BookingFormData>({
    courtName: '',
    date: '',
    time: '',
    timeEnd: '',
    duration: 1
  });

  const [bookedHours, setBookedHours] = useState<string[]>([]);
  const [bookedRanges, setBookedRanges] = useState<{start: number, end: number}[]>([]);

  // Ambil jam yang sudah dibooking setiap kali lapangan & tanggal berubah
  useEffect(() => {
    const fetchBookedHours = async () => {
      setBookedHours([]);
      if (!formData.courtName || !formData.date) return;
      const nomorLapangan = parseInt(formData.courtName.replace(/\D/g, ''));
      // Cari id_lapangan
      const { data: lapanganData } = await supabase
        .from('lapangan')
        .select('id')
        .eq('nomor_lapangan', nomorLapangan)
        .single();
      if (!lapanganData) return;
      // Ambil semua jam_mulai yang sudah dibooking di tanggal & lapangan tsb
      const { data: pesanan } = await supabase
        .from('pesanan')
        .select('jam_mulai')
        .eq('id_lapangan', lapanganData.id)
        .eq('tanggal', formData.date)
        .in('status_pesanan', ['menunggu', 'dikonfirmasi']);
      if (pesanan) {
        setBookedHours(pesanan.map((p: any) => p.jam_mulai));
      }
    };
    fetchBookedHours();
  }, [formData.courtName, formData.date]);

  useEffect(() => {
    const fetchBookedRanges = async () => {
      setBookedRanges([]);
      if (!formData.courtName || !formData.date) return;
      const nomorLapangan = parseInt(formData.courtName.replace(/\D/g, ''));
      // Cari id_lapangan
      const { data: lapanganData } = await supabase
        .from('lapangan')
        .select('id')
        .eq('nomor_lapangan', nomorLapangan)
        .single();
      if (!lapanganData) return;
      // Ambil semua booking di tanggal & lapangan tsb
      const { data: pesanan } = await supabase
        .from('pesanan')
        .select('jam_mulai, jam_selesai')
        .eq('id_lapangan', lapanganData.id)
        .eq('tanggal', formData.date)
        .in('status_pesanan', ['menunggu', 'dikonfirmasi']);
      if (pesanan) {
        setBookedRanges(pesanan.map((p: any) => ({
          start: parseInt(p.jam_mulai.split(':')[0], 10),
          end: parseInt(p.jam_selesai.split(':')[0], 10)
        })));
      }
    };
    fetchBookedRanges();
  }, [formData.courtName, formData.date]);

  const isOverlapping = (start: number, end: number) => {
    return bookedRanges.some(b => Math.max(b.start, start) < Math.min(b.end, end));
  };

  // Fungsi untuk mendapatkan opsi waktu selesai berdasarkan waktu mulai dan jam yang sudah dibooking
  const getEndTimeOptions = () => {
    if (!formData.time) return HOURS.slice(1);
    const startIdx = HOURS.indexOf(formData.time);
    const start = parseInt(HOURS[startIdx].split(':')[0], 10);
    // Cari jam selesai yang tidak overlap booking lain
    let options: string[] = [];
    for (let i = startIdx + 1; i <= HOURS.length; i++) {
      if (i >= HOURS.length) break;
      const end = parseInt(HOURS[i].split(':')[0], 10);
      if (isOverlapping(start, end)) break;
      options.push(HOURS[i]);
    }
    return options;
  };

  // Fungsi untuk menghitung durasi otomatis
  const getDuration = () => {
    if (!formData.time || !formData.timeEnd) return 0;
    const start = parseInt(formData.time.split(':')[0], 10);
    const end = parseInt(formData.timeEnd.split(':')[0], 10);
    return end > start ? end - start : 0;
  };

  // Fungsi untuk mendapatkan jam yang masih bisa dipilih (tidak lewat jika hari ini)
  const getAvailableStartHours = () => {
    if (!formData.date) return HOURS;
    const today = new Date();
    const isToday = today.toISOString().split('T')[0] === formData.date;
    let available = HOURS;
    if (isToday) {
      const currentHour = today.getHours();
      available = HOURS.filter((hour) => parseInt(hour.split(':')[0], 10) > currentHour);
    }
    // Hanya jam mulai yang tidak overlap booking lain
    return available.filter((hour, idx) => {
      const start = parseInt(hour.split(':')[0], 10);
      // Cek minimal 1 jam booking
      return !isOverlapping(start, start + 1);
    });
  };

  // CREATE - Handler untuk submit form booking
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ ...formData, duration: getDuration() }); // Kirim durasi hasil kalkulasi
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Lapangan Baru</h3>
        {/* CREATE - Form untuk membuat booking baru */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* CREATE - Input untuk memilih lapangan */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pilih Lapangan
            </label>
            <select
              value={formData.courtName}
              onChange={(e) => setFormData({ ...formData, courtName: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500"
              required
            >
              <option value="">Pilih lapangan</option>
              <option value="Lapangan 1">Lapangan 1</option>
              <option value="Lapangan 2">Lapangan 2</option>
              <option value="Lapangan 3">Lapangan 3</option>
            </select>
          </div>
          
          {/* CREATE - Input untuk tanggal booking */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tanggal
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 bg-white"
              required
              min={new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().split('T')[0]}
            />
          </div>
          
          {/* CREATE - Input untuk waktu mulai booking */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Waktu Mulai
            </label>
            <select
              value={formData.time}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  time: e.target.value,
                  timeEnd: '' // reset waktu selesai jika waktu mulai berubah
                });
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500"
              required
            >
              <option value="">Pilih jam mulai</option>
              {getAvailableStartHours().map((hour) => (
                <option key={hour} value={hour}>{hour}</option>
              ))}
            </select>
          </div>
          
          {/* CREATE - Input untuk waktu selesai booking */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Waktu Selesai
            </label>
            <select
              value={formData.timeEnd}
              onChange={(e) => setFormData({ ...formData, timeEnd: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500"
              required
              disabled={!formData.time}
            >
              <option value="">Pilih jam selesai</option>
              {getEndTimeOptions().map((hour) => (
                <option key={hour} value={hour}>{hour}</option>
              ))}
            </select>
          </div>
          
          {/* CREATE - Input untuk durasi booking (otomatis, disabled) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Durasi (jam)
            </label>
            <input
              type="number"
              value={getDuration()}
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-900 focus:outline-none"
              disabled
            />
          </div>
          
          {/* CREATE - Tombol aksi untuk form */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            >
              Batal
            </button>
            {/* CREATE - Tombol submit untuk membuat booking */}
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Booking
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 