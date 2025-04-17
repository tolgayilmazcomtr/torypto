import { useState, useEffect } from 'react';
import authService from '@/services/authService';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const fetchUser = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const hasToken = authService.isAuthenticated();
      
      if (!hasToken) {
        console.log('Token bulunamadı, kullanıcı bilgileri alınmayacak');
        setUser(null);
        setLoading(false);
        return;
      }
      
      console.log('Mevcut kullanıcı bilgileri alınıyor...');
      const userData = await authService.getCurrentUser();
      console.log('Kullanıcı bilgileri başarıyla alındı:', userData);
      
      setUser(userData);
    } catch (error: any) {
      console.error('Kullanıcı bilgilerini alma hatası:', error);
      setError(error.message || 'Kullanıcı bilgileri alınamadı');
      authService.logout();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoggingIn(true);
    setError(null);
    
    try {
      console.log('Giriş işlemi başlatılıyor...');
      const response = await authService.login(email, password);
      console.log('Giriş işlemi başarılı!');
      
      setUser(response.user);
      return response;
    } catch (error: any) {
      console.error('Giriş hatası:', error);
      setError(error.message || 'Giriş işlemi başarısız oldu.');
      throw error;
    } finally {
      setIsLoggingIn(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setIsRegistering(true);
    setError(null);
    
    try {
      console.log('Kayıt işlemi başlatılıyor...');
      const response = await authService.register(name, email, password);
      console.log('Kayıt işlemi başarılı!');
      
      setUser(response.user);
      return response;
    } catch (error: any) {
      console.error('Kayıt hatası:', error);
      setError(error.message || 'Kayıt işlemi başarısız oldu.');
      throw error;
    } finally {
      setIsRegistering(false);
    }
  };

  const logout = () => {
    console.log('Çıkış yapılıyor...');
    authService.logout();
    setUser(null);
    console.log('Çıkış yapıldı');
  };

  const refreshUser = async () => {
    await fetchUser();
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return {
    user,
    loading,
    error,
    isLoggingIn,
    isRegistering,
    login,
    register,
    logout,
    refreshUser,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin'
  };
} 