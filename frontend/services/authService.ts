import axios from 'axios'
import { ApiResponse, TokenResponse, UserResponse } from '@/types/api';
import { mockDb } from '@/lib/mock-data';
import { User } from '@/types/api';
import Cookies from 'js-cookie';

// İstemci tarafında mı, yoksa sunucu tarafında mı olduğumuzu kontrol et
const isBrowser = typeof window !== 'undefined';

// API URL'sini kontrol et
// CLIENT_URL Next.js API'leri için göreceli yol
// SERVER_URL harici API server'ı için
const CLIENT_URL = '';
const SERVER_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Axios instance oluştur
const api = axios.create({
  baseURL: isBrowser ? CLIENT_URL : SERVER_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
})

console.log('API URL:', isBrowser ? 'Frontend API kullanılıyor' : SERVER_URL);

export interface LoginResponse {
  token: string
  user: User
}

export interface RegisterData {
  name: string
  email: string
  password: string
}

class AuthService {
  private tokenKey = 'auth_token';
  private userKey = 'user_data';

  constructor() {
    // Constructor'da token kontrolü kaldırıldı
  }

  async register(name: string, email: string, password: string): Promise<{ user: User; token: string }> {
    try {
      console.log('Kayıt isteği gönderiliyor:', { name, email, password: '***' });
      
      const existingUser = mockDb.findUserByEmail(email);
      if (existingUser) {
        throw new Error('Bu email adresi zaten kullanımda');
      }

      // Admin kontrolü - ilk kullanıcı admin olsun
      const isFirstUser = mockDb.getUsers().length === 0;
      
      // Yeni kullanıcı oluştur
      const newUser = mockDb.addUser({
        name,
        email,
        password,
        role: isFirstUser ? 'admin' : 'user',
        status: 'active',
        is_admin: isFirstUser,
        is_superuser: isFirstUser
      });

      // Token oluştur ve kaydet
      const token = this.generateToken();
      this.setTokenAndUser(token, newUser);
      
      // Son giriş zamanını güncelle
      mockDb.updateLastLogin(newUser.id);
      
      return { user: newUser, token };
    } catch (error: any) {
      console.error('Kayıt hatası:', error);
      throw error;
    }
  }

  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    try {
      console.log('Giriş isteği gönderiliyor:', { email, password: '***' });
      
      const user = mockDb.findUserByEmail(email);
      
      if (!user || user.password !== password) {
        throw new Error('Geçersiz email veya şifre');
      }

      // Giriş başarılı - token ve kullanıcı bilgilerini kaydet
      const token = this.generateToken();
      this.setTokenAndUser(token, user);
      
      // Son giriş zamanını güncelle
      mockDb.updateLastLogin(user.id);
      
      return { user, token };
    } catch (error: any) {
      console.error('Giriş hatası:', error);
      throw error;
    }
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    Cookies.remove(this.tokenKey);
    Cookies.remove(this.userKey);
  }

  isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;
    const token = localStorage.getItem(this.tokenKey) || Cookies.get(this.tokenKey);
    const userData = localStorage.getItem(this.userKey) || Cookies.get(this.userKey);
    return !!token && !!userData;
  }

  isAdmin(): boolean {
    if (typeof window === 'undefined') return false;
    const userData = localStorage.getItem(this.userKey) || Cookies.get(this.userKey);
    if (!userData) return false;
    try {
      const user = JSON.parse(userData) as User;
      return user.role === 'admin' && user.is_admin;
    } catch {
      return false;
    }
  }

  getCurrentUser(): User | null {
    if (typeof window === 'undefined') return null;
    const userData = localStorage.getItem(this.userKey) || Cookies.get(this.userKey);
    if (!userData) return null;
    try {
      return JSON.parse(userData) as User;
    } catch {
      return null;
    }
  }

  private setTokenAndUser(token: string, user: User): void {
    // LocalStorage'a kaydet
    localStorage.setItem(this.tokenKey, token);
    localStorage.setItem(this.userKey, JSON.stringify(user));
    
    // Çerezlere kaydet
    Cookies.set(this.tokenKey, token, { expires: 7 }); // 7 gün geçerli
    Cookies.set(this.userKey, JSON.stringify(user), { expires: 7 });
  }

  private generateToken(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  async forgotPassword(email: string): Promise<ApiResponse<any>> {
    try {
      const response = await api.post('/api/auth/forgot-password', { email })
      return response.data
    } catch (error: any) {
      console.error('Şifre sıfırlama hatası:', error)
      if (error.response) {
        console.error('API yanıtı:', error.response.data)
        const message = error.response.data.message || 'Şifre sıfırlama işlemi başarısız oldu'
        throw new Error(message)
      }
      throw new Error('Bağlantı hatası oluştu')
    }
  }

  resetPassword(token: string, password: string) {
    try {
      console.log('Şifre yenileme isteği gönderiliyor');
      return api.post('/api/auth/reset-password', { token, password });
    } catch (error: any) {
      console.error('Şifre yenileme hatası:', error);
      throw new Error(error.response?.data?.message || 'Şifre yenileme işlemi başarısız oldu.');
    }
  }
}

// Tek bir authService instance'ı oluştur
const authService = new AuthService()

export default authService 