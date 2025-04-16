import React from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { useTheme } from '@/hooks/useTheme';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { mounted } = useTheme();

  // Tema geçişinde yanıp sönmeyi önlemek için ilk render'da içeriği gösterme
  if (!mounted) {
    return null;
  }

  return (
    <div className="bg-background text-foreground">
      <Sidebar />
      <div className="flex min-h-screen flex-col md:pl-64">
        <Header />
        <main className="flex-1 p-4 md:p-8">{children}</main>
        <footer className="border-t py-4 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Torypto. Tüm hakları saklıdır.</p>
        </footer>
      </div>
    </div>
  );
};

export default Layout; 