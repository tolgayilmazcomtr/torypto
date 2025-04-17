import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthContext } from '@/contexts/AuthContext';
import { 
  Home, 
  Users, 
  BarChart, 
  Bell, 
  Settings, 
  LogOut,
  ChevronDown,
  ChevronUp,
  Shield,
  Activity,
  MessageSquare,
  CreditCard,
  HelpCircle,
  Code,
  Database,
  LineChart,
  TrendingUp
} from 'lucide-react';

// Admin menü öğeleri
const adminMenuItems = [
  {
    title: 'Dashboard',
    href: '/admin/dashboard',
    icon: Home
  },
  {
    title: 'Kullanıcılar',
    href: '/admin/users',
    icon: Users
  },
  {
    title: 'Sistem İzleme',
    href: '/admin/monitoring',
    icon: Activity
  },
  {
    title: 'API Yönetimi',
    href: '/admin/api',
    icon: Code
  },
  {
    title: 'Sembol Yönetimi',
    href: '/admin/symbols',
    icon: Database
  },
  {
    title: 'Sinyaller',
    href: '/admin/signals',
    icon: Bell
  },
  {
    title: 'Ödemeler',
    href: '/admin/payments',
    icon: CreditCard
  },
  {
    title: 'Affiliate',
    href: '/admin/affiliates',
    icon: Users
  },
  {
    title: 'Mesajlar',
    href: '/admin/messages',
    icon: MessageSquare
  },
  {
    title: 'Ayarlar',
    href: '/admin/settings',
    icon: Settings
  }
];

// Kullanıcı menü öğeleri
const userMenuItems = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: Home
  },
  {
    title: 'Kripto Analizi',
    href: '/dashboard/crypto-analysis',
    icon: LineChart
  },
  {
    title: 'Analizler',
    href: '/dashboard/analytics',
    icon: BarChart
  },
  {
    title: 'Sinyaller',
    href: '/dashboard/signals',
    icon: TrendingUp
  },
  {
    title: 'Mesajlar',
    href: '/dashboard/messages',
    icon: MessageSquare
  },
  {
    title: 'Ödemeler',
    href: '/dashboard/payments',
    icon: CreditCard
  },
  {
    title: 'Ayarlar',
    href: '/dashboard/settings',
    icon: Settings
  },
  {
    title: 'Yardım',
    href: '/dashboard/help',
    icon: HelpCircle
  }
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuthContext();
  const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(false);

  const isActive = (href: string) => {
    return pathname === href;
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <h1 className="text-xl font-bold text-gray-800">Torypto</h1>
        <p className="text-sm text-gray-500">Kripto Analiz Platformu</p>
      </div>

      <nav className="flex-1 overflow-y-auto py-2">
        {/* Admin Menüsü */}
        {(user?.isAdmin || user?.role === 'admin') && (
          <div className="mb-2">
            <button
              onClick={() => setIsAdminMenuOpen(!isAdminMenuOpen)}
              className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-50"
            >
              <Shield className="h-5 w-5 mr-2" />
              <span className="font-medium">Admin Paneli</span>
              {isAdminMenuOpen ? (
                <ChevronUp className="h-4 w-4 ml-auto" />
              ) : (
                <ChevronDown className="h-4 w-4 ml-auto" />
              )}
            </button>

            {isAdminMenuOpen && (
              <div className="mt-1 bg-gray-50">
                {adminMenuItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center px-6 py-2 text-sm ${
                      isActive(item.href)
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <item.icon className="h-5 w-5 mr-2" />
                    {item.title}
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Kullanıcı Menüsü */}
        <div>
          {userMenuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center px-4 py-2 text-sm ${
                isActive(item.href)
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <item.icon className="h-5 w-5 mr-2" />
              {item.title}
            </Link>
          ))}
        </div>
      </nav>

      {/* Çıkış Yap */}
      <div className="border-t p-4">
        <button
          onClick={logout}
          className="flex w-full items-center px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded"
        >
          <LogOut className="h-5 w-5 mr-2" />
          Çıkış Yap
        </button>
      </div>
    </div>
  );
} 