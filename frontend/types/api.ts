// API yanıt tipleri
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  status?: string;
}

// Kimlik doğrulama tipleri
export interface TokenResponse {
  token: string;
}

export interface UserResponse {
  user: User;
}

// Kripto para tipleri
export interface SymbolPrice {
  symbol: string;
  price: number | string;
}

export interface KlineData {
  open_time: number | string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  close_time: number | string;
  quote_volume: number;
  trades: number;
  taker_buy_base: number;
  taker_buy_quote: number;
}

export interface Symbol {
  symbol: string;
  base_asset: string;
  quote_asset: string;
  name?: string;
  icon_url?: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface MarketData {
  [quoteAsset: string]: Array<{
    symbol: string;
    price: string;
  }>;
}

// İstek parametreleri tipleri
export interface GetKlinesParams {
  interval?: string;
  limit?: number;
  start_time?: number;
  end_time?: number;
  add_indicators?: boolean;
}

export interface GetPricesParams {
  symbols?: string;
}

export interface GetSymbolsParams {
  active_only?: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
  status: 'active' | 'inactive';
  is_admin: boolean;
  is_superuser: boolean;
  lastLogin: string;
}

export type CryptoSymbol = {
  symbol: string;
  baseAsset: string;
  quoteAsset: string;
  status?: string;
  price?: number;
  priceChangePercent?: number;
  iconUrl?: string;
}; 