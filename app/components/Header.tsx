import Link from 'next/link';
import { Badge, LogOut } from 'lucide-react';

interface HeaderProps {
  title: string;
  showNav?: boolean;
  onLogout?: () => void;
}

export default function Header({ title, showNav = true, onLogout }: HeaderProps) {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div className="flex items-center space-x-2">
            <Badge className="h-8 w-8 text-green-600" />
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          </div>
          {showNav ? (
            <nav className="flex space-x-8">
              <Link href="/login" className="text-gray-600 hover:text-green-600 transition-colors">
                Login
              </Link>
              <Link href="/register" className="text-gray-600 hover:text-green-600 transition-colors">
                Register
              </Link>
            </nav>
          ) : (
            onLogout && (
              <button
                onClick={onLogout}
                className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors"
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </button>
            )
          )}
        </div>
      </div>
    </header>
  );
} 