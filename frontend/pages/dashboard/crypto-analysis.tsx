import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import cryptoService, { CryptoSymbol, AnalysisResult } from '@/services/cryptoService';
import { BarChart, LineChart, PieChart } from 'lucide-react';
import dynamic from 'next/dynamic';

// ChartJS dinamik olarak yükleniyor (SSR uyumluluğu için)
const CandlestickChart = dynamic(() => import('@/components/charts/CandlestickChart'), {
  ssr: false,
  loading: () => <div className="h-72 w-full flex items-center justify-center">Grafik yükleniyor...</div>,
});

const IndicatorChart = dynamic(() => import('@/components/charts/IndicatorChart'), {
  ssr: false,
  loading: () => <div className="h-48 w-full flex items-center justify-center">Gösterge yükleniyor...</div>,
});

export default function CryptoAnalysisPage() {
  const [symbols, setSymbols] = useState<CryptoSymbol[]>([]);
  const [selectedSymbol, setSelectedSymbol] = useState<string>('BTCUSDT');
  const [interval, setInterval] = useState<string>('1h');
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [chartData, setChartData] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Sembolleri yükle
  useEffect(() => {
    const loadSymbols = async () => {
      try {
        const data = await cryptoService.getSymbols();
        setSymbols(data);
      } catch (error) {
        console.error('Semboller yüklenirken hata oluştu:', error);
      }
    };

    loadSymbols();
  }, []);

  // Seçili sembol veya aralık değiştiğinde analiz yap
  useEffect(() => {
    if (selectedSymbol) {
      performAnalysis();
    }
  }, [selectedSymbol, interval]);

  // Analiz yap
  const performAnalysis = async () => {
    setLoading(true);
    try {
      // Kline verilerini al
      const klineData = await cryptoService.getKlines(selectedSymbol, interval, 100, true);
      setChartData(
        klineData.map((item) => ({
          time: new Date(item.open_time).getTime() / 1000,
          open: item.open,
          high: item.high,
          low: item.low,
          close: item.close,
          volume: item.volume,
        }))
      );

      // Analiz verilerini al
      const analysisData = await cryptoService.getAnalysis(selectedSymbol, interval);
      setAnalysis(analysisData);
    } catch (error) {
      console.error('Analiz yapılırken hata oluştu:', error);
    } finally {
      setLoading(false);
    }
  };

  // Sembol arama işlevi
  const filteredSymbols = symbols.filter(
    (symbol) =>
      symbol.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      symbol.baseAsset.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Trend rengini belirle
  const getTrendColor = (trend: string): string => {
    if (trend.includes('yükseliş') || trend === 'AL' || trend === 'GÜÇLÜ AL') {
      return 'bg-green-100 text-green-800';
    } else if (trend.includes('düşüş') || trend === 'SAT' || trend === 'GÜÇLÜ SAT') {
      return 'bg-red-100 text-red-800';
    } else {
      return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Kripto Analizi</h1>
      </div>

      <div className="grid grid-cols-1 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Analiz Ayarları</CardTitle>
            <CardDescription>Analiz yapmak istediğiniz kripto parayı ve zaman dilimini seçin</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Kripto Para</label>
                <Select value={selectedSymbol} onValueChange={setSelectedSymbol}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sembol seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    {symbols.map((symbol) => (
                      <SelectItem key={symbol.symbol} value={symbol.symbol}>
                        {symbol.symbol} ({symbol.baseAsset})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Zaman Dilimi</label>
                <Select value={interval} onValueChange={setInterval}>
                  <SelectTrigger>
                    <SelectValue placeholder="Zaman dilimi seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1m">1 Dakika</SelectItem>
                    <SelectItem value="5m">5 Dakika</SelectItem>
                    <SelectItem value="15m">15 Dakika</SelectItem>
                    <SelectItem value="30m">30 Dakika</SelectItem>
                    <SelectItem value="1h">1 Saat</SelectItem>
                    <SelectItem value="4h">4 Saat</SelectItem>
                    <SelectItem value="1d">1 Gün</SelectItem>
                    <SelectItem value="1w">1 Hafta</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="mt-4">
              <Button onClick={performAnalysis} className="w-full">
                Analiz Et
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {loading ? (
        <div className="text-center py-8">Analiz yapılıyor...</div>
      ) : analysis ? (
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="overview">
              <BarChart className="h-4 w-4 mr-2" />
              Genel Bakış
            </TabsTrigger>
            <TabsTrigger value="chart">
              <LineChart className="h-4 w-4 mr-2" />
              Grafik
            </TabsTrigger>
            <TabsTrigger value="indicators">
              <PieChart className="h-4 w-4 mr-2" />
              Göstergeler
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Fiyat Bilgisi</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Sembol:</span>
                      <span className="font-medium">{analysis.symbol}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Son Fiyat:</span>
                      <span className="font-medium">${analysis.last_price.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Değişim:</span>
                      <span
                        className={
                          analysis.price_change >= 0 ? 'text-green-600 font-medium' : 'text-red-600 font-medium'
                        }
                      >
                        ${analysis.price_change.toFixed(2)} (
                        {analysis.price_change_percent.toFixed(2)}%)
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Zaman Aralığı:</span>
                      <span className="font-medium">{analysis.interval}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Trend Analizi</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Genel Trend:</span>
                      <Badge className={getTrendColor(analysis.trend.overall)}>
                        {analysis.trend.overall}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">MA Trend:</span>
                      <Badge className={getTrendColor(analysis.trend.ma_trend)}>
                        {analysis.trend.ma_trend}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">RSI Durumu:</span>
                      <Badge className={getTrendColor(analysis.trend.rsi_status)}>
                        {analysis.trend.rsi_status}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">MACD Trend:</span>
                      <Badge className={getTrendColor(analysis.trend.macd_trend)}>
                        {analysis.trend.macd_trend}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Sinyal Analizi</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analysis.signals && Object.entries(analysis.signals).map(([key, value]) => (
                      <div key={key} className="flex justify-between items-center">
                        <span className="text-muted-foreground capitalize">
                          {key === 'macd' ? 'MACD' : 
                           key === 'rsi' ? 'RSI' : 
                           key === 'bollinger' ? 'Bollinger' : 
                           key === 'stochastic' ? 'Stochastic' : 
                           key === 'ma_cross' ? 'MA Kesişimi' : 
                           key === 'combined' ? 'Birleşik' : key}:
                        </span>
                        <Badge className={getTrendColor(value)}>{value}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Destek ve Direnç Seviyeleri</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-medium mb-2">Direnç Seviyeleri</h3>
                      <div className="space-y-2">
                        {analysis.support_resistance.resistance.map((level, index) => (
                          <div key={index} className="flex justify-between">
                            <span className="text-muted-foreground">Direnç {index + 1}:</span>
                            <span className="font-medium">${level.toFixed(2)}</span>
                          </div>
                        ))}
                        {analysis.support_resistance.resistance.length === 0 && (
                          <div className="text-sm text-muted-foreground">Direnç seviyesi bulunamadı</div>
                        )}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium mb-2">Destek Seviyeleri</h3>
                      <div className="space-y-2">
                        {analysis.support_resistance.support.map((level, index) => (
                          <div key={index} className="flex justify-between">
                            <span className="text-muted-foreground">Destek {index + 1}:</span>
                            <span className="font-medium">${level.toFixed(2)}</span>
                          </div>
                        ))}
                        {analysis.support_resistance.support.length === 0 && (
                          <div className="text-sm text-muted-foreground">Destek seviyesi bulunamadı</div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="chart">
            <Card className="w-full">
              <CardHeader>
                <CardTitle>Fiyat Grafiği - {selectedSymbol}</CardTitle>
                <CardDescription>
                  {interval} zaman diliminde {selectedSymbol} fiyat hareketleri
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[500px] w-full">
                  {chartData.length > 0 ? (
                    <CandlestickChart data={chartData} />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center">
                      Grafik verisi bulunamadı
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="indicators">
            <div className="grid grid-cols-1 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Teknik Göstergeler</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Gösterge</TableHead>
                        <TableHead>Değer</TableHead>
                        <TableHead>Yorum</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>RSI (14)</TableCell>
                        <TableCell>{analysis.indicators.rsi?.toFixed(2)}</TableCell>
                        <TableCell>
                          <Badge className={getTrendColor(analysis.trend.rsi_status)}>
                            {analysis.trend.rsi_status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>MACD</TableCell>
                        <TableCell>{analysis.indicators.macd?.toFixed(2)}</TableCell>
                        <TableCell>
                          <Badge className={getTrendColor(analysis.trend.macd_trend)}>
                            {analysis.trend.macd_trend}
                          </Badge>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>MA (7)</TableCell>
                        <TableCell>{analysis.indicators.ma7?.toFixed(2)}</TableCell>
                        <TableCell>
                          <Badge className={getTrendColor(analysis.trend.ma_trend)}>
                            {analysis.trend.ma_trend}
                          </Badge>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>MA (25)</TableCell>
                        <TableCell>{analysis.indicators.ma25?.toFixed(2)}</TableCell>
                        <TableCell>
                          {analysis.indicators.ma7 > analysis.indicators.ma25 ? (
                            <Badge className="bg-green-100 text-green-800">MA7 {'>'} MA25</Badge>
                          ) : (
                            <Badge className="bg-red-100 text-red-800">MA7 {'<'} MA25</Badge>
                          )}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Bollinger Üst</TableCell>
                        <TableCell>{analysis.indicators.bb_upper?.toFixed(2)}</TableCell>
                        <TableCell rowSpan={3}>
                          <Badge className={getTrendColor(analysis.trend.bb_status)}>
                            {analysis.trend.bb_status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Bollinger Orta</TableCell>
                        <TableCell>{analysis.indicators.bb_middle?.toFixed(2)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Bollinger Alt</TableCell>
                        <TableCell>{analysis.indicators.bb_lower?.toFixed(2)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Stochastic K</TableCell>
                        <TableCell>{analysis.indicators.stoch_k?.toFixed(2)}</TableCell>
                        <TableCell rowSpan={2}>
                          <Badge className={getTrendColor(analysis.trend.stoch_status)}>
                            {analysis.trend.stoch_status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Stochastic D</TableCell>
                        <TableCell>{analysis.indicators.stoch_d?.toFixed(2)}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      ) : (
        <div className="text-center py-8">Analiz için bir sembol ve zaman dilimi seçin.</div>
      )}
    </>
  );
} 