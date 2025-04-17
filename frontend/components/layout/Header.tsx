import React from 'react';
import { Bell, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '../ui/button';
import { useRouter } from 'next/router';

export default function Header() {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  
  // Sayfa başlığını belirleme
  const getPageTitle = () => {
    const path = router.pathname;
    if (path === '/' || path === '/dashboard') return 'Dashboard';
    if (path === '/signals') return 'Kripto Sinyalleri';
    if (path === '/analizler') return 'Kripto Analizleri';
    if (path === '/notifications') return 'Bildirimler';
    if (path === '/settings') return 'Ayarlar';
    if (path === '/admin/dashboard') return 'Admin Paneli';
    if (path === '/admin/users') return 'Kullanıcı Yönetimi';
    
    // Path'in son kısmını al
    const parts = path.split('/');
    const lastPart = parts[parts.length - 1];
    return lastPart.charAt(0).toUpperCase() + lastPart.slice(1);
  };

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="h-16 px-6 flex items-center justify-between">
        <div className="flex-1">
          <h1 className="text-xl font-semibold">{getPageTitle()}</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>

          <Button variant="ghost" size="icon" aria-label="Notifications">
            <Bell className="h-5 w-5" />
          </Button>

          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700" />
            <span className="text-sm font-medium">tolga</span>
          </div>
        </div>
      </div>
    </header>
  );
} 