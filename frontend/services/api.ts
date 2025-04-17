import axios, { AxiosResponse } from 'axios';
import { 
  ApiResponse, 
  TokenResponse, 
  UserResponse, 
  SymbolPrice, 
  KlineData, 
  Symbol, 
  MarketData,
  GetKlinesParams,
  GetPricesParams,
  GetSymbolsParams
} from '../types/api';

// API temel URL yapılandırması
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Axios örneği oluştur
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// İstek interceptor - token eklemek için
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Yanıt interceptor - hata işleme için
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // 401 Unauthorized hatası durumunda kullanıcıyı çıkış yap
    if (error.response && error.response.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        window.location.href = '/auth/login';
      }
    }
    return Promise.reject(error);
  }
);

// API servisleri
const ApiService = {
  // Auth servisleri
  auth: {
    login: (data: { username: string; password: string }): Promise<AxiosResponse<TokenResponse>> => 
      apiClient.post('/api/auth/login', data),
    register: (data: { username: string; email: string; password: string }): Promise<AxiosResponse<UserResponse>> => 
      apiClient.post('/api/auth/register', data),
    me: (): Promise<AxiosResponse<UserResponse>> => 
      apiClient.get('/api/users/me'),
  },
  
  // Kripto para servisleri
  crypto: {
    getMarkets: (): Promise<AxiosResponse<MarketData>> => 
      apiClient.get('/api/crypto/markets'),
    getPrices: (params?: GetPricesParams): Promise<AxiosResponse<SymbolPrice[]>> => 
      apiClient.get('/api/crypto/prices', { params }),
    getPrice: (symbol: string): Promise<AxiosResponse<SymbolPrice>> => 
      apiClient.get(`/api/crypto/price/${symbol}`),
    getKlines: (symbol: string, params?: GetKlinesParams): Promise<AxiosResponse<KlineData[]>> => 
      apiClient.get(`/api/crypto/klines/${symbol}`, { params }),
  },
  
  // Sembol servisleri
  symbols: {
    getAll: (params?: GetSymbolsParams): Promise<AxiosResponse<Symbol[]>> => 
      apiClient.get('/symbols', { params }),
    getSymbol: (symbol: string): Promise<AxiosResponse<Symbol>> => 
      apiClient.get(`/symbols/${symbol}`),
    create: (data: Symbol): Promise<AxiosResponse<Symbol>> => 
      apiClient.post('/symbols', data),
    update: (symbol: string, data: Partial<Symbol>): Promise<AxiosResponse<Symbol>> => 
      apiClient.put(`/symbols/${symbol}`, data),
    delete: (symbol: string): Promise<AxiosResponse<Symbol>> => 
      apiClient.delete(`/symbols/${symbol}`),
  },
};

export default ApiService; 