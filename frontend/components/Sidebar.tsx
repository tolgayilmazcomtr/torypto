import React from 'react';
import { useRouter } from 'next/router';

// Bu dosyayı kullanmıyoruz artık - Tüm sidebar işlevselliği layout/Sidebar.tsx'te
export default function Sidebar() {
  const router = useRouter();
  
  // Sayfa açılınca yeni sidebar'a yönlendir
  React.useEffect(() => {
    router.push(router.pathname);
  }, []);
  
  return null;
} 