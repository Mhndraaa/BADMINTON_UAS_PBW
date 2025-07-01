import { Trash2, Check, X } from 'lucide-react';
import StatusBadge from './StatusBadge';
import { Booking } from '../types';

interface BookingCardProps {
  booking: Booking;
  onCancel?: (id: string) => void;    // UPDATE - Fungsi untuk membatalkan booking
  onConfirm?: (id: string) => void;   // UPDATE - Fungsi untuk konfirmasi booking (admin)
  onReject?: (id: string) => void;    // UPDATE - Fungsi untuk tolak booking (admin)
  showActions?: boolean;
  isAdmin?: boolean;
}

export default function BookingCard({ 
  booking, 
  onCancel, 
  onConfirm, 
  onReject, 
  showActions = true, 
  isAdmin = false 
}: BookingCardProps) {
  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="flex justify-between items-start">
        {/* READ - Menampilkan informasi booking */}
        <div>
          <h3 className="font-semibold text-gray-900">{booking.courtName}</h3>
          {isAdmin && booking.userName && (
            <p className="text-sm text-gray-600">User: {booking.userName}</p>
          )}
          <p className="text-sm text-gray-600">
            {new Date(booking.date).toLocaleDateString('id-ID')} - {booking.time}
          </p>
          <p className="text-sm text-gray-600">Durasi: {booking.duration} jam</p>
        </div>
        <div className="flex items-center space-x-2">
          {/* READ - Menampilkan status booking */}
          <StatusBadge status={booking.status} />
          
          {/* UPDATE - Tombol aksi untuk booking yang masih pending */}
          {showActions && booking.status === 'pending' && (
            <div className="flex space-x-1">
              {isAdmin ? (
                <>
                  {/* UPDATE - Tombol konfirmasi booking (admin) */}
                  <button
                    onClick={() => onConfirm?.(booking.id)}
                    className="text-green-600 hover:text-green-800"
                    title="Konfirmasi"
                  >
                    <Check className="h-4 w-4" />
                  </button>
                  {/* UPDATE - Tombol tolak booking (admin) */}
                  <button
                    onClick={() => onReject?.(booking.id)}
                    className="text-red-600 hover:text-red-800"
                    title="Tolak"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </>
              ) : (
                /* UPDATE - Tombol batalkan booking (user) */
                <button
                  onClick={() => onCancel?.(booking.id)}
                  className="text-red-600 hover:text-red-800"
                  title="Batalkan"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 