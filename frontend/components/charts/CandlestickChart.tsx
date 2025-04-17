import React, { useEffect, useRef } from 'react';
import { createChart, IChartApi, ISeriesApi, CandlestickData } from 'lightweight-charts';

interface CandlestickChartProps {
  data: CandlestickData[];
}

const CandlestickChart: React.FC<CandlestickChartProps> = ({ data }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);

  useEffect(() => {
    if (chartContainerRef.current) {
      // Eğer grafik zaten varsa temizle
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
        seriesRef.current = null;
      }

      // Yeni grafik oluştur
      const chart = createChart(chartContainerRef.current, {
        width: chartContainerRef.current.clientWidth,
        height: chartContainerRef.current.clientHeight,
        layout: {
          background: { color: '#ffffff' },
          textColor: '#333',
        },
        grid: {
          vertLines: { color: '#f0f0f0' },
          horzLines: { color: '#f0f0f0' },
        },
        crosshair: {
          mode: 0,
        },
        timeScale: {
          borderColor: '#ddd',
          timeVisible: true,
          secondsVisible: false,
        },
        rightPriceScale: {
          borderColor: '#ddd',
        },
      });

      // Mum serisi oluştur
      const candlestickSeries = chart.addCandlestickSeries({
        upColor: '#4caf50',
        downColor: '#ef5350',
        borderUpColor: '#4caf50',
        borderDownColor: '#ef5350',
        wickUpColor: '#4caf50',
        wickDownColor: '#ef5350',
      });

      // Verileri ayarla
      candlestickSeries.setData(data);

      // Grafik boyutunu ayarla
      chart.applyOptions({
        watermark: {
          color: 'rgba(0, 0, 0, 0.05)',
          visible: true,
          text: 'Torypto',
          fontSize: 36,
          horzAlign: 'center',
          vertAlign: 'center',
        },
      });

      // Pencere yeniden boyutlandırıldığında grafiği güncelle
      const handleResize = () => {
        if (chartContainerRef.current && chartRef.current) {
          chartRef.current.applyOptions({
            width: chartContainerRef.current.clientWidth,
            height: chartContainerRef.current.clientHeight,
          });
        }
      };

      window.addEventListener('resize', handleResize);

      // Referansları sakla
      chartRef.current = chart;
      seriesRef.current = candlestickSeries;

      // Temizleme fonksiyonu
      return () => {
        window.removeEventListener('resize', handleResize);
        if (chartRef.current) {
          chartRef.current.remove();
          chartRef.current = null;
          seriesRef.current = null;
        }
      };
    }
  }, []);

  // Veriler değiştiğinde güncelle
  useEffect(() => {
    if (seriesRef.current && data.length > 0) {
      seriesRef.current.setData(data);
    }
  }, [data]);

  return <div ref={chartContainerRef} className="w-full h-full" />;
};

export default CandlestickChart; 