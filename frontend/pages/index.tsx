import React from 'react';
import AnalysisChart from '@/components/dashboard/AnalysisChart';
import SignalList from '@/components/dashboard/SignalList';
import CryptoList from '@/components/dashboard/CryptoList';
import { useSymbolPrices } from '../hooks/useCrypto';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ArrowUpIcon, ArrowDownIcon, TrendingUpIcon, LineChartIcon, BarChartIcon } from 'lucide-react';

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

const HomePage: React.FC = () => {
  const topSymbols = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'SOLUSDT', 'ADAUSDT'];
  const { prices: cryptoPrices, loading, error } = useSymbolPrices(topSymbols, 10000);
  
  // Eğer cryptoPrices yoksa boş bir array kullan
  const cryptoListData = cryptoPrices && cryptoPrices.length > 0 
    ? cryptoPrices.map(item => {
        const symbol = item.symbol.replace('USDT', '');
        return {
          id: symbol,
          symbol: symbol,
          name: getFullName(symbol),
          price: typeof item.price === 'number' ? item.price : parseFloat(item.price as string),
          change24h: getRandomChange(),
          volume24h: getRandomVolume(symbol),
          marketCap: getRandomMarketCap(symbol),
          logoUrl: `https://cryptologos.cc/logos/${getLogoName(symbol)}-logo.png`,
        };
      })
    : [];

  // Yardımcı fonksiyonlar
  function getFullName(symbol: string): string {
    const names: Record<string, string> = {
      'BTC': 'Bitcoin',
      'ETH': 'Ethereum',
      'BNB': 'Binance Coin',
      'SOL': 'Solana',
      'ADA': 'Cardano',
      'XRP': 'Ripple',
      'DOT': 'Polkadot'
    };
    return names[symbol] || symbol;
  }

  function getLogoName(symbol: string): string {
    const logos: Record<string, string> = {
      'BTC': 'bitcoin-btc',
      'ETH': 'ethereum-eth',
      'BNB': 'bnb-bnb',
      'SOL': 'solana-sol',
      'ADA': 'cardano-ada',
      'XRP': 'xrp-xrp',
      'DOT': 'polkadot-new-dot'
    };
    return logos[symbol] || symbol.toLowerCase();
  }

  function getRandomChange(): number {
    return Math.round((Math.random() * 10 - 3) * 100) / 100;
  }

  function getRandomVolume(symbol: string): number {
    const baseVolume = {
      'BTC': 25000000000,
      'ETH': 15000000000,
      'BNB': 3000000000,
      'SOL': 3200000000,
      'ADA': 800000000,
      'XRP': 1500000000,
      'DOT': 500000000
    };
    const base = baseVolume[symbol] || 500000000;
    return base + Math.random() * base * 0.2;
  }

  function getRandomMarketCap(symbol: string): number {
    const baseMarketCap = {
      'BTC': 1300000000000,
      'ETH': 400000000000,
      'BNB': 80000000000,
      'SOL': 60000000000,
      'ADA': 20000000000,
      'XRP': 30000000000,
      'DOT': 10000000000
    };
    const base = baseMarketCap[symbol] || 5000000000;
    return base + Math.random() * base * 0.1;
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Üst Bar */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Gösterge Paneli</h1>
          <p className="text-muted-foreground">Kripto piyasası ve sinyaller</p>
        </div>
        <div className="flex items-center gap-4">
          <Select defaultValue="1d">
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Zaman Aralığı" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1h">Son 1 Saat</SelectItem>
              <SelectItem value="24h">Son 24 Saat</SelectItem>
              <SelectItem value="1d">Bugün</SelectItem>
              <SelectItem value="7d">Son 7 Gün</SelectItem>
              <SelectItem value="30d">Son 30 Gün</SelectItem>
            </SelectContent>
          </Select>
          <Button>
            <TrendingUpIcon className="mr-2 h-4 w-4" />
            Analiz Yap
          </Button>
        </div>
      </div>

      {/* Ana Grid */}
      <div className="grid grid-cols-12 gap-6">
        {/* Sol Taraf - Grafik ve İstatistikler */}
        <div className="col-span-8 space-y-6">
          {/* Grafik Kartı */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle>BTC/USDT Analizi</CardTitle>
                <p className="text-sm text-muted-foreground">Günlük fiyat hareketi ve teknik analiz</p>
              </div>
              <Tabs defaultValue="candle">
                <TabsList>
                  <TabsTrigger value="candle">
                    <BarChartIcon className="h-4 w-4" />
                  </TabsTrigger>
                  <TabsTrigger value="line">
                    <LineChartIcon className="h-4 w-4" />
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent>
              <AnalysisChart symbol="BTC/USDT" interval="1H" data={chartData} />
            </CardContent>
          </Card>

          {/* İstatistik Kartları */}
          <div className="grid grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Toplam Sinyal</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">127</div>
                <p className="text-xs text-muted-foreground">Son 30 gün</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Başarı Oranı</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-success">%78.5</div>
                <p className="text-xs text-muted-foreground">Kapalı sinyaller</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Aktif Sinyal</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">12</div>
                <p className="text-xs text-muted-foreground">Açık pozisyonlar</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Sağ Taraf - Sinyaller ve Liste */}
        <div className="col-span-4 space-y-6">
          {/* Sinyaller */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Son Sinyaller</CardTitle>
                <Tabs defaultValue="all" className="w-fit">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="all">Tümü</TabsTrigger>
                    <TabsTrigger value="buy">Alış</TabsTrigger>
                    <TabsTrigger value="sell">Satış</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </CardHeader>
            <CardContent>
              <SignalList signals={exampleSignals} showAll={false} />
            </CardContent>
          </Card>

          {/* Kripto Listesi */}
          <CryptoList cryptos={cryptoListData} loading={loading} error={error} onViewAll={() => console.log('Tüm kripto paraları görüntüle')} />
        </div>
      </div>
    </div>
  );
};

export default HomePage; 