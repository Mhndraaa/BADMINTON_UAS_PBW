import { Settings } from 'lucide-react';
import StatusBadge from './StatusBadge';
import { Court } from '../types';

interface CourtCardProps {
  court: Court;
  onStatusChange: (id: string, status: Court['status']) => void;
}

export default function CourtCard({ court, onStatusChange }: CourtCardProps) {
  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-semibold text-gray-900">{court.name}</h3>
          <StatusBadge status={court.status} />
        </div>
        <div className="flex items-center space-x-2">
          <select
            value={court.status}
            onChange={(e) => onStatusChange(court.id, e.target.value as Court['status'])}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
          >
            <option value="available">Tersedia</option>
            <option value="booked">Dibooking</option>
            <option value="maintenance">Maintenance</option>
          </select>
          <Settings className="h-4 w-4 text-gray-400" />
        </div>
      </div>
    </div>
  );
} 