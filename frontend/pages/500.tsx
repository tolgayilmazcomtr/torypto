import React from 'react';
import Link from 'next/link';

const ServerErrorPage = () => {
  return (
    <div className="flex h-[70vh] flex-col items-center justify-center text-center">
      <h1 className="mb-2 text-6xl font-bold text-primary">500</h1>
      <h2 className="mb-6 text-2xl font-medium">Sunucu Hatası</h2>
      <p className="mb-8 max-w-md text-muted-foreground">
        Üzgünüz, bir sunucu hatası oluştu. Teknik ekibimiz sorun üzerinde çalışıyor.
        Lütfen daha sonra tekrar deneyin.
      </p>
      <Link href="/">
        <span className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
          Ana Sayfaya Dön
        </span>
      </Link>
    </div>
  );
};

export default ServerErrorPage; 