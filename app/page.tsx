import Link from 'next/link';
import { Calendar, Clock, MapPin } from 'lucide-react';
import Header from './components/Header';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <Header title="ShuttleTime" />

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            Pesan Lapangan Bulu Tangkis
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Booking lapangan bulu tangkis dengan mudah dan cepat. 
            Tersedia berbagai pilihan waktu dan lapangan berkualitas.
          </p>
          <div className="flex justify-center space-x-4">
            <Link 
              href="/login" 
              className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors"
            >
              Mulai Booking
            </Link>
            <Link 
              href="/register" 
              className="border border-green-600 text-green-600 px-8 py-3 rounded-lg hover:bg-green-50 transition-colors"
            >
              Daftar Sekarang
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6 bg-white rounded-lg shadow-sm">
            <Calendar className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Booking Mudah</h3>
            <p className="text-gray-600">Pesan lapangan dengan mudah melalui website kami</p>
          </div>
          <div className="text-center p-6 bg-white rounded-lg shadow-sm">
            <Clock className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Fleksibel</h3>
            <p className="text-gray-600">Pilih waktu yang sesuai dengan jadwal Anda</p>
          </div>
          <div className="text-center p-6 bg-white rounded-lg shadow-sm">
            <MapPin className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Lokasi Strategis</h3>
            <p className="text-gray-600">Lapangan berada di lokasi yang mudah dijangkau</p>
          </div>
        </div>
      </main>
    </div>
  );
}
