import React, { useEffect, useRef } from 'react';
import { createChart, ColorType, IChartApi, LineStyle } from 'lightweight-charts';
import { useTheme } from 'next-themes';

interface IndicatorChartProps {
  data: {
    time: number;
    value: number;
  }[];
  colors?: {
    backgroundColor?: string;
    lineColor?: string;
    textColor?: string;
    areaTopColor?: string;
    areaBottomColor?: string;
  };
  width?: number;
  height?: number;
  title?: string;
  type?: 'line' | 'area';
  upperBand?: {
    time: number;
    value: number;
  }[];
  lowerBand?: {
    time: number;
    value: number;
  }[];
  middleBand?: {
    time: number;
    value: number;
  }[];
  threshold?: number[];
}

const IndicatorChart: React.FC<IndicatorChartProps> = ({
  data,
  colors = {},
  width,
  height,
  title = '',
  type = 'line',
  upperBand,
  lowerBand,
  middleBand,
  threshold,
}) => {
  const {
    backgroundColor = 'white',
    lineColor = '#2962FF',
    textColor = '#191919',
    areaTopColor = 'rgba(41, 98, 255, 0.28)',
    areaBottomColor = 'rgba(41, 98, 255, 0.05)',
  } = colors;

  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const { theme } = useTheme();

  useEffect(() => {
    if (!chartContainerRef.current || !data.length) return;

    const handleResize = () => {
      if (chartRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current?.clientWidth || width,
        });
      }
    };

    // Theme renkleri ayarla
    const isDarkTheme = theme === 'dark';
    const chartBackground = isDarkTheme ? '#1a1a1a' : backgroundColor;
    const chartTextColor = isDarkTheme ? '#d1d4dc' : textColor;
    const chartLineColor = isDarkTheme ? '#5d8aec' : lineColor;

    // Grafik oluştur
    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: chartBackground },
        textColor: chartTextColor,
      },
      width: chartContainerRef.current.clientWidth || width || 600,
      height: height || 200,
      grid: {
        vertLines: {
          color: isDarkTheme ? 'rgba(42, 46, 57, 0.5)' : 'rgba(42, 46, 57, 0.1)',
        },
        horzLines: {
          color: isDarkTheme ? 'rgba(42, 46, 57, 0.5)' : 'rgba(42, 46, 57, 0.1)',
        },
      },
      timeScale: {
        borderColor: chartLineColor,
        visible: true,
      },
      rightPriceScale: {
        borderColor: chartLineColor,
        scaleMargins: {
          top: 0.1,
          bottom: 0.1,
        },
      },
      crosshair: {
        mode: 1, // Dikey çizgi modu
      },
    });

    chartRef.current = chart;

    // Ana gösterge serisini ekle
    if (type === 'line') {
      const lineSeries = chart.addLineSeries({
        color: chartLineColor,
        lineWidth: 2,
        title: title,
      });
      lineSeries.setData(data);
    } else if (type === 'area') {
      const areaSeries = chart.addAreaSeries({
        lineColor: chartLineColor,
        topColor: areaTopColor,
        bottomColor: areaBottomColor,
        lineWidth: 2,
        title: title,
      });
      areaSeries.setData(data);
    }

    // Üst ve alt bandı (örn. Bollinger Bands) ekle
    if (upperBand) {
      const upperSeries = chart.addLineSeries({
        color: 'rgba(255, 70, 70, 0.8)',
        lineStyle: LineStyle.Dashed,
        lineWidth: 1,
      });
      upperSeries.setData(upperBand);
    }

    if (lowerBand) {
      const lowerSeries = chart.addLineSeries({
        color: 'rgba(255, 70, 70, 0.8)',
        lineStyle: LineStyle.Dashed,
        lineWidth: 1,
      });
      lowerSeries.setData(lowerBand);
    }

    if (middleBand) {
      const middleSeries = chart.addLineSeries({
        color: 'rgba(255, 140, 0, 0.8)',
        lineStyle: LineStyle.Dashed,
        lineWidth: 1,
      });
      middleSeries.setData(middleBand);
    }

    // Threshold çizgileri ekle (örn. RSI için 30 ve 70)
    if (threshold && threshold.length) {
      threshold.forEach((value, index) => {
        const thresholdSeries = chart.addLineSeries({
          color: index === 0 ? 'rgba(76, 175, 80, 0.6)' : 'rgba(255, 82, 82, 0.6)',
          lineStyle: LineStyle.Dotted,
          lineWidth: 1,
        });

        // Threshold için X ekseninin başlangıç ve bitiş zamanlarını al
        const timeMin = data[0].time;
        const timeMax = data[data.length - 1].time;

        // Threshold çizgisini oluştur
        thresholdSeries.setData([
          { time: timeMin, value },
          { time: timeMax, value },
        ]);
      });
    }

    // Pencere yeniden boyutlandırıldığında grafiği yeniden boyutlandır
    window.addEventListener('resize', handleResize);

    // Grafik görünüşünü ayarla
    chart.timeScale().fitContent();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
      }
    };
  }, [
    data,
    backgroundColor,
    lineColor,
    textColor,
    areaTopColor,
    areaBottomColor,
    width,
    height,
    title,
    type,
    upperBand,
    lowerBand,
    middleBand,
    threshold,
    theme,
  ]);

  // Tema değiştiğinde grafiği güncelle
  useEffect(() => {
    if (!chartRef.current) return;

    const isDarkTheme = theme === 'dark';
    const chartBackground = isDarkTheme ? '#1a1a1a' : backgroundColor;
    const chartTextColor = isDarkTheme ? '#d1d4dc' : textColor;

    chartRef.current.applyOptions({
      layout: {
        background: { type: ColorType.Solid, color: chartBackground },
        textColor: chartTextColor,
      },
    });
  }, [theme, backgroundColor, textColor]);

  return <div ref={chartContainerRef} className="w-full h-full" />;
};

export default IndicatorChart; 