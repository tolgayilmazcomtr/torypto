import React, { ReactNode } from 'react';
import Head from 'next/head';
import Sidebar from './Sidebar';
import Header from './Header';
import { useRouter } from 'next/router';
import { useAuthContext } from '@/contexts/AuthContext';

type LayoutProps = {
  children: ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  const router = useRouter();
  const { user, loading } = useAuthContext();
  const isAuthenticated = !!user;

  // Auth sayfalarında basit layout göster
  if (router.pathname.startsWith('/auth/')) {
    return <>{children}</>;
  }

  // Yükleme durumunda loading göster
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Kullanıcı giriş yapmamışsa ve auth sayfasında değilse yönlendir
  if (!isAuthenticated && !router.pathname.startsWith('/auth/')) {
    router.push('/auth/login');
    return null;
  }

  return (
    <>
      <Head>
        <title>Torypto - Kripto Analiz Platformu</title>
        <meta name="description" content="Kripto analiz ve takip platformu" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Sabit Sidebar */}
        <div className="fixed inset-y-0 left-0 w-56 bg-white border-r z-30">
          <Sidebar />
        </div>

        {/* Sabit Header */}
        <div className="fixed top-0 left-56 right-0 z-20">
          <Header />
        </div>

        {/* Ana İçerik Alanı - Sidebar genişliği kadar margin ve header yüksekliği kadar padding */}
        <div className="ml-56 pt-16">
          <main className="p-6">
            {children}
          </main>
        </div>
      </div>
    </>
  );
} 