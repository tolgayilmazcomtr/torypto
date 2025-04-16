import React from 'react';
import Layout from '@/components/layout/Layout';
import AnalysisChart from '@/components/dashboard/AnalysisChart';
import SignalList from '@/components/dashboard/SignalList';
import CryptoList from '@/components/dashboard/CryptoList';

// Örnek veri
const chartData = [
  { time: '2023-04-01', open: 42000, high: 43000, low: 41800, close: 42500 },
  { time: '2023-04-02', open: 42500, high: 43200, low: 42200, close: 43100 },
  { time: '2023-04-03', open: 43100, high: 43800, low: 42900, close: 43600 },
  { time: '2023-04-04', open: 43600, high: 44100, low: 43200, close: 43900 },
  { time: '2023-04-05', open: 43900, high: 44500, low: 43800, close: 44200 },
  { time: '2023-04-06', open: 44200, high: 45000, low: 44000, close: 44800 },
  { time: '2023-04-07', open: 44800, high: 45500, low: 44600, close: 45200 },
  { time: '2023-04-08', open: 45200, high: 46000, low: 45000, close: 45800 },
  { time: '2023-04-09', open: 45800, high: 46200, low: 45200, close: 45400 },
  { time: '2023-04-10', open: 45400, high: 45600, low: 44800, close: 45100 },
  { time: '2023-04-11', open: 45100, high: 45800, low: 44900, close: 45600 },
  { time: '2023-04-12', open: 45600, high: 46400, low: 45400, close: 46200 },
  { time: '2023-04-13', open: 46200, high: 47000, low: 46000, close: 46800 },
  { time: '2023-04-14', open: 46800, high: 47500, low: 46600, close: 47200 },
  { time: '2023-04-15', open: 47200, high: 48000, low: 47000, close: 47800 },
  { time: '2023-04-16', open: 47800, high: 48400, low: 47400, close: 48200 },
  { time: '2023-04-17', open: 48200, high: 49000, low: 48000, close: 48800 },
  { time: '2023-04-18', open: 48800, high: 49500, low: 48600, close: 49200 },
  { time: '2023-04-19', open: 49200, high: 50000, low: 49000, close: 49800 },
  { time: '2023-04-20', open: 49800, high: 50500, low: 49500, close: 50200 },
];

const exampleSignals = [
  {
    id: '1',
    symbol: 'BTC/USDT',
    type: 'BUY',
    price: 67500,
    takeProfit: 72000,
    stopLoss: 65000,
    timestamp: '2023-04-20T10:30:00Z',
    confidence: 85,
    status: 'ACTIVE',
  },
  {
    id: '2',
    symbol: 'ETH/USDT',
    type: 'SELL',
    price: 3400,
    takeProfit: 3000,
    stopLoss: 3600,
    timestamp: '2023-04-19T14:45:00Z',
    confidence: 78,
    status: 'COMPLETED',
  },
  {
    id: '3',
    symbol: 'SOL/USDT',
    type: 'BUY',
    price: 140,
    takeProfit: 160,
    stopLoss: 130,
    timestamp: '2023-04-18T08:15:00Z',
    confidence: 72,
    status: 'CANCELLED',
  },
] as const;

const popularCryptos = [
  {
    id: '1',
    symbol: 'BTC',
    name: 'Bitcoin',
    price: 67842.5,
    change24h: 2.34,
    volume24h: 28500000000,
    marketCap: 1320000000000,
    logoUrl: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png',
  },
  {
    id: '2',
    symbol: 'ETH',
    name: 'Ethereum',
    price: 3450.78,
    change24h: 1.56,
    volume24h: 15400000000,
    marketCap: 420000000000,
    logoUrl: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
  },
  {
    id: '3',
    symbol: 'SOL',
    name: 'Solana',
    price: 142.6,
    change24h: 3.78,
    volume24h: 3280000000,
    marketCap: 62000000000,
    logoUrl: 'https://cryptologos.cc/logos/solana-sol-logo.png',
  },
  {
    id: '4',
    symbol: 'ADA',
    name: 'Cardano',
    price: 0.512,
    change24h: -1.25,
    volume24h: 780000000,
    marketCap: 18000000000,
    logoUrl: 'https://cryptologos.cc/logos/cardano-ada-logo.png',
  },
  {
    id: '5',
    symbol: 'DOT',
    name: 'Polkadot',
    price: 7.84,
    change24h: -0.87,
    volume24h: 430000000,
    marketCap: 10200000000,
    logoUrl: 'https://cryptologos.cc/logos/polkadot-new-dot-logo.png',
  },
] as const;

const HomePage: React.FC = () => {
  return (
    <Layout>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gösterge Paneli</h1>
          <p className="text-muted-foreground">Kripto pazarına genel bakış ve analizler</p>
        </div>
        <div className="flex gap-2">
          <select className="h-9 rounded-md border border-input bg-background px-3 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
            <option value="today">Bugün</option>
            <option value="week">Bu Hafta</option>
            <option value="month">Bu Ay</option>
            <option value="year">Bu Yıl</option>
          </select>
          <button className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
            Analiz Yap
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <AnalysisChart symbol="BTC/USDT" interval="1H" data={chartData} />
          
          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="rounded-lg border bg-card p-6 shadow-sm">
              <h3 className="mb-2 text-lg font-medium">Son Analizler</h3>
              <div className="space-y-4">
                <div className="rounded-md bg-muted/50 p-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">BTC/USDT</span>
                    <span className="text-xs text-muted-foreground">1 saat önce</span>
                  </div>
                  <p className="mt-2 text-sm">Bitcoin şu anda kritik bir direnç noktasında. RSI göstergesi aşırı alım bölgesinde.</p>
                </div>
                
                <div className="rounded-md bg-muted/50 p-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">ETH/USDT</span>
                    <span className="text-xs text-muted-foreground">3 saat önce</span>
                  </div>
                  <p className="mt-2 text-sm">Ethereum, orta vadeli bir yükseliş trendi içinde. MACD sinyali pozitif.</p>
                </div>
              </div>
              <div className="mt-4 text-center">
                <button className="text-sm font-medium text-primary hover:underline">
                  Tüm Analizleri Gör
                </button>
              </div>
            </div>
            
            <div className="rounded-lg border bg-card p-6 shadow-sm">
              <h3 className="mb-2 text-lg font-medium">Analiz Özeti</h3>
              <div className="divide-y">
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm">Günlük Kullanılan Analiz</span>
                  <span className="font-medium">2/3</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm">Premium Durumu</span>
                  <span className="rounded-full bg-warning/10 px-2 py-0.5 text-xs font-medium text-warning">
                    Ücretsiz
                  </span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm">En Son Analiz</span>
                  <span className="text-sm text-muted-foreground">1 saat önce</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm">Başarılı Sinyaller</span>
                  <span className="font-medium text-success">14/20</span>
                </div>
              </div>
              <div className="mt-4">
                <button className="inline-flex w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                  Premium'a Yükselt
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <SignalList signals={exampleSignals} />
          <CryptoList cryptos={popularCryptos} />
        </div>
      </div>
    </Layout>
  );
};

export default HomePage; 