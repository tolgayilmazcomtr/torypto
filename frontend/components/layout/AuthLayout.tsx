import React, { ReactNode, useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';

type AuthLayoutProps = {
  children: ReactNode;
  title?: string;
  description?: string;
};

const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  title = 'Torypto - Kripto Para Analiz Platformu',
  description = 'Torypto kripto para analiz ve takip platformu.'
}) => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Komponent mount edildikten sonra render işlemlerini yap
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <div className="flex items-center justify-between p-4 sm:p-6">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">Torypto</span>
        </Link>
        {mounted && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            aria-label="Tema değiştir"
          >
            {theme === 'dark' ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
        )}
      </div>
      
      <main>
        {children}
      </main>
      
      <footer className="py-6 text-center text-sm text-gray-500 dark:text-gray-400">
        <p>© {new Date().getFullYear()} Torypto. Tüm hakları saklıdır.</p>
      </footer>
    </div>
  );
};

export default AuthLayout; 