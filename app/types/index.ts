export interface Booking {
  id: string;
  courtName: string;
  date: string;
  time: string; // format: HH:00 (waktu mulai)
  timeEnd: string; // format: HH:00 (waktu selesai)
  duration: number;
  status: 'confirmed' | 'pending' | 'cancelled';
  userName?: string;
}

export interface Court {
  id: string;
  name: string;
  status: 'available' | 'maintenance' | 'booked';
}

export interface User {
  id: string;
  name: string;
  email: string;
  userType: 'user' | 'admin';
}

export interface BookingFormData {
  courtName: string;
  date: string;
  time: string; // format: HH:00, waktu mulai
  timeEnd: string; // format: HH:00, waktu selesai
  duration: number;
} 