import React, { useEffect, useRef } from 'react';
import { createChart, ColorType, IChartApi, ISeriesApi } from 'lightweight-charts';

interface AnalysisChartProps {
  symbol: string;
  interval: string;
  data: {
    time: string; // ISO date string
    open: number;
    high: number;
    low: number;
    close: number;
    volume?: number;
  }[];
}

const AnalysisChart: React.FC<AnalysisChartProps> = ({ symbol, interval, data }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candlestickSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // Güvenli bir şekilde önceki grafiği temizle
    const cleanupChart = () => {
      if (chartRef.current) {
        try {
          chartRef.current.remove();
        } catch (error) {
          console.warn('Chart cleanup failed:', error);
        }
        chartRef.current = null;
        candlestickSeriesRef.current = null;
      }
    };

    // Önceki grafiği temizle
    cleanupChart();

    // Mevcut temanın dark olup olmadığını kontrol et
    const isDarkTheme = document.documentElement.classList.contains('dark');

    // Grafik yapılandırması
    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: isDarkTheme ? '#D9D9D9' : '#1F2937',
      },
      width: chartContainerRef.current.clientWidth,
      height: 400,
      grid: {
        vertLines: {
          color: isDarkTheme ? 'rgba(70, 70, 70, 0.2)' : 'rgba(220, 220, 220, 0.8)',
        },
        horzLines: {
          color: isDarkTheme ? 'rgba(70, 70, 70, 0.2)' : 'rgba(220, 220, 220, 0.8)',
        },
      },
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
      },
      crosshair: {
        mode: 0,
      },
    });

    // Mum grafiği serisi ekle
    const candlestickSeries = chart.addCandlestickSeries({
      upColor: '#22c55e',
      downColor: '#ef4444',
      borderVisible: false,
      wickUpColor: '#22c55e',
      wickDownColor: '#ef4444',
    });

    // Verileri ayarla
    candlestickSeries.setData(data);

    // Referansları kaydet
    chartRef.current = chart;
    candlestickSeriesRef.current = candlestickSeries;

    // Pencere boyutu değiştiğinde grafiği yeniden boyutlandır
    const handleResize = () => {
      if (chartRef.current && chartContainerRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    };

    window.addEventListener('resize', handleResize);

    // Tema değişirse grafiği güncelle
    const handleThemeChange = () => {
      const newIsDarkTheme = document.documentElement.classList.contains('dark');
      if (chartRef.current) {
        chartRef.current.applyOptions({
          layout: {
            textColor: newIsDarkTheme ? '#D9D9D9' : '#1F2937',
          },
          grid: {
            vertLines: {
              color: newIsDarkTheme ? 'rgba(70, 70, 70, 0.2)' : 'rgba(220, 220, 220, 0.8)',
            },
            horzLines: {
              color: newIsDarkTheme ? 'rgba(70, 70, 70, 0.2)' : 'rgba(220, 220, 220, 0.8)',
            },
          },
        });
      }
    };

    // MutationObserver kullanarak tema değişikliklerini izle
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.attributeName === 'class' &&
          mutation.target === document.documentElement
        ) {
          handleThemeChange();
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true });

    return () => {
      window.removeEventListener('resize', handleResize);
      observer.disconnect();
      cleanupChart();
    };
  }, [data, symbol, interval]);

  return (
    <div className="w-full rounded-lg border bg-card p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">{symbol}</h3>
          <p className="text-sm text-muted-foreground">{interval} Aralık</p>
        </div>
        <div className="flex space-x-2">
          <button className="rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
            1H
          </button>
          <button className="rounded-md px-2 py-1 text-xs font-medium text-muted-foreground">
            4H
          </button>
          <button className="rounded-md px-2 py-1 text-xs font-medium text-muted-foreground">
            1D
          </button>
          <button className="rounded-md px-2 py-1 text-xs font-medium text-muted-foreground">
            1W
          </button>
        </div>
      </div>
      <div ref={chartContainerRef} className="lightweight-chart-container h-[400px]" />
      <div className="mt-4 rounded-md bg-muted/50 p-3">
        <h4 className="text-sm font-medium">AI Analizi:</h4>
        <p className="mt-1 text-sm text-muted-foreground">
          BTC/USDT şu anda güçlü bir yükseliş trendi gösteriyor. RSI 65 seviyesinde ve MACD pozitif bölgede. 
          Direnç: $68,500, Destek: $66,200. Kısa vadeli alım fırsatı olabilir.
        </p>
      </div>
    </div>
  );
};

export default AnalysisChart; 