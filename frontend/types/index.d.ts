// React ve Next.js için tip tanımlamaları
import { ReactNode } from 'react';

// Tema tipleri
export type Theme = 'light' | 'dark' | 'system';

// Sayfa özellikleri
export interface PageProps {
  children?: ReactNode;
}

// Kripto para verileri
export interface CryptoData {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  volume24h: number;
  marketCap?: number;
  logoUrl?: string;
}

// Sinyal verileri
export interface SignalData {
  id: string;
  symbol: string;
  type: 'BUY' | 'SELL';
  price: number;
  takeProfit: number;
  stopLoss: number;
  timestamp: string;
  confidence: number;
  status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
}

// Grafik verileri
export interface ChartData {
  time: string; // ISO date string
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
}

// Analiz verileri
export interface AnalysisData {
  id: string;
  symbol: string;
  interval: string;
  timestamp: string;
  indicators: {
    rsi?: number;
    macd?: {
      value: number;
      signal: number;
      histogram: number;
    };
    ema?: {
      ema20: number;
      ema50: number;
      ema200: number;
    };
    bollingerBands?: {
      upper: number;
      middle: number;
      lower: number;
    };
  };
  analysis: string;
  recommendation: 'BUY' | 'SELL' | 'HOLD' | 'WATCH';
  targetPrice?: number;
  stopLossPrice?: number;
  confidence: number;
} 