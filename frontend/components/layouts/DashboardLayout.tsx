import React, { ReactNode } from 'react';
import { useRouter } from 'next/router';
import { useAuthContext } from '@/contexts/AuthContext';
import Sidebar from '@/components/layout/Sidebar';
import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const { user, isLoading } = useAuthContext();
  const { theme, setTheme } = useTheme();

  // Kullanıcı giriş yapmadıysa login sayfasına yönlendir
  React.useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, isLoading, router]);

  // Kullanıcı bilgileri yüklenene kadar loading göster
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Kullanıcı giriş yapmadıysa içeriği gösterme
  if (!user) {
    return null;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col bg-white dark:bg-gray-800 border-r dark:border-gray-700">
        <Sidebar />
      </div>

      {/* Ana içerik */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Üst çubuk */}
        <div className="flex items-center justify-between px-6 py-4 bg-white dark:bg-gray-800 border-b dark:border-gray-700">
          <div>
            <h1 className="text-xl font-semibold text-gray-800 dark:text-white">Dashboard</h1>
          </div>
          <div className="flex items-center space-x-4">
            {/* Tema değiştirme buton */}
            <Button
              variant="outline"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="rounded-full"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>

            {/* Kullanıcı adı/profil */}
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-medium">
                {user.username ? user.username.charAt(0).toUpperCase() : 'U'}
              </div>
              <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                {user.username || 'Kullanıcı'}
              </span>
            </div>
          </div>
        </div>

        {/* Sayfa içeriği */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="container mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
} 