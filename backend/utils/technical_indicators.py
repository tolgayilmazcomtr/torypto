import pandas as pd
import numpy as np
from typing import Dict, Any, List, Optional, Union

class TechnicalIndicators:
    """
    Kripto para analizi için teknik göstergeler hesaplama yardımcısı
    """
    
    @staticmethod
    def calculate_indicators(df: pd.DataFrame) -> pd.DataFrame:
        """
        Fiyat verileri üzerinde teknik göstergeleri hesaplar
        
        Args:
            df: OHLCV verilerini içeren DataFrame
                [timestamp, open, high, low, close, volume, ...]
                
        Returns:
            pd.DataFrame: Göstergeler eklenmiş DataFrame
        """
        # Veri setini kopyala (yan etkileri önle)
        result_df = df.copy()
        
        # SMA (Basit Hareketli Ortalama)
        result_df['sma_20'] = TechnicalIndicators.sma(result_df['close'], 20)
        result_df['sma_50'] = TechnicalIndicators.sma(result_df['close'], 50)
        result_df['sma_200'] = TechnicalIndicators.sma(result_df['close'], 200)
        
        # EMA (Üssel Hareketli Ortalama)
        result_df['ema_12'] = TechnicalIndicators.ema(result_df['close'], 12)
        result_df['ema_26'] = TechnicalIndicators.ema(result_df['close'], 26)
        
        # MACD (Hareketli Ortalama Yakınsama/Iraksama)
        macd_result = TechnicalIndicators.macd(result_df['close'])
        result_df['macd'] = macd_result['macd']
        result_df['macd_signal'] = macd_result['signal']
        result_df['macd_histogram'] = macd_result['histogram']
        
        # RSI (Göreceli Güç Endeksi)
        result_df['rsi_14'] = TechnicalIndicators.rsi(result_df['close'], 14)
        
        # Bollinger Bantları
        bollinger = TechnicalIndicators.bollinger_bands(result_df['close'])
        result_df['bollinger_upper'] = bollinger['upper']
        result_df['bollinger_middle'] = bollinger['middle']
        result_df['bollinger_lower'] = bollinger['lower']
        
        # Stokastik Osilatör
        stoch = TechnicalIndicators.stochastic(result_df)
        result_df['stoch_k'] = stoch['k']
        result_df['stoch_d'] = stoch['d']
        
        # ATR (Ortalama Gerçek Aralık)
        result_df['atr'] = TechnicalIndicators.atr(result_df)
        
        # OBV (Bir Dengeli Hacim)
        result_df['obv'] = TechnicalIndicators.obv(result_df)

        # İçerik temizleme (NaN değerleri kaldır veya doldur)
        # Teknik göstergeler genellikle periyot sayısı kadar NaN değerler içerir
        # result_df = result_df.dropna()  # ya da
        result_df = result_df.fillna(0)  # Geçiş kolaylığı için 0 ile doldurma
        
        return result_df
    
    # Uyumluluk için metot isimleri
    @staticmethod
    def add_all_indicators(df: pd.DataFrame) -> pd.DataFrame:
        """calculate_indicators metodunun diğer adı - crypto.py için uyumluluk"""
        return TechnicalIndicators.calculate_indicators(df)
    
    @staticmethod
    def analyze_trend(df: pd.DataFrame) -> Dict[str, Any]:
        """
        Teknik göstergeleri kullanarak trendin durumunu analiz eder
        
        Args:
            df: Teknik göstergeler içeren DataFrame
            
        Returns:
            Dict: Trend analizi sonuçları
        """
        # Son fiyat ve göstergeleri al
        last_row = df.iloc[-1]
        
        # Trend analizi
        trend = {
            "price": last_row['close'],
            "trend": "Belirsiz",
            "strength": 0,
            "signals": [],
            "sma_20": last_row['sma_20'],
            "sma_50": last_row['sma_50'],
            "sma_200": last_row['sma_200'],
            "rsi": last_row['rsi_14'],
            "macd": last_row['macd'],
            "macd_signal": last_row['macd_signal'],
            "stoch_k": last_row['stoch_k'],
            "stoch_d": last_row['stoch_d']
        }
        
        signals = []
        strength = 0
        
        # MA analizleri
        if last_row['close'] > last_row['sma_20']:
            signals.append("Fiyat SMA20'nin üzerinde")
            strength += 1
        else:
            signals.append("Fiyat SMA20'nin altında")
            strength -= 1
        
        if last_row['close'] > last_row['sma_50']:
            signals.append("Fiyat SMA50'nin üzerinde")
            strength += 1
        else:
            signals.append("Fiyat SMA50'nin altında")
            strength -= 1
        
        if last_row['close'] > last_row['sma_200']:
            signals.append("Fiyat SMA200'ün üzerinde (Uzun vadeli yükseliş)")
            strength += 2
        else:
            signals.append("Fiyat SMA200'ün altında (Uzun vadeli düşüş)")
            strength -= 2
        
        # RSI analizi
        if last_row['rsi_14'] > 70:
            signals.append("RSI aşırı alım bölgesinde (>70)")
            strength -= 1
        elif last_row['rsi_14'] < 30:
            signals.append("RSI aşırı satım bölgesinde (<30)")
            strength += 1
        
        # MACD analizi
        if last_row['macd'] > last_row['macd_signal']:
            signals.append("MACD sinyal çizgisinin üzerinde (Yükseliş)")
            strength += 1
        else:
            signals.append("MACD sinyal çizgisinin altında (Düşüş)")
            strength -= 1
        
        # Stokastik analizi
        if last_row['stoch_k'] > last_row['stoch_d']:
            signals.append("Stokastik K > D (Yükseliş)")
            strength += 1
        else:
            signals.append("Stokastik K < D (Düşüş)")
            strength -= 1
        
        if last_row['stoch_k'] > 80:
            signals.append("Stokastik aşırı alım bölgesinde (>80)")
            strength -= 1
        elif last_row['stoch_k'] < 20:
            signals.append("Stokastik aşırı satım bölgesinde (<20)")
            strength += 1
        
        # Bollinger Bantları analizi
        if last_row['close'] > last_row['bollinger_upper']:
            signals.append("Fiyat üst Bollinger bandının üzerinde (Aşırı alım)")
            strength -= 1
        elif last_row['close'] < last_row['bollinger_lower']:
            signals.append("Fiyat alt Bollinger bandının altında (Aşırı satım)")
            strength += 1
        
        # Trend belirleme
        if strength >= 4:
            trend["trend"] = "Güçlü Yükseliş"
        elif strength >= 2:
            trend["trend"] = "Yükseliş"
        elif strength <= -4:
            trend["trend"] = "Güçlü Düşüş"
        elif strength <= -2:
            trend["trend"] = "Düşüş"
        else:
            trend["trend"] = "Nötr/Yatay"
        
        trend["strength"] = strength
        trend["signals"] = signals
        
        return trend
    
    # Uyumluluk için metot isimleri
    @staticmethod
    def get_trend(df: pd.DataFrame) -> Dict[str, Any]:
        """analyze_trend metodunun diğer adı - crypto.py için uyumluluk"""
        return TechnicalIndicators.analyze_trend(df)
    
    @staticmethod
    def get_signals(df: pd.DataFrame) -> Dict[str, str]:
        """
        Alım-satım sinyallerini döndürür - crypto.py için uyumluluk
        """
        last_row = df.iloc[-1]
        prev_row = df.iloc[-2] if len(df) > 1 else None
        
        signals = {
            "overall": "Nötr",
            "ma": "Nötr",
            "macd": "Nötr", 
            "rsi": "Nötr",
            "stoch": "Nötr",
            "bollinger": "Nötr"
        }
        
        # Trend analizi sonuçlarını al
        trend_analysis = TechnicalIndicators.analyze_trend(df)
        signals["overall"] = trend_analysis["trend"]
        
        # MA sinyali
        if last_row['close'] > last_row['sma_20'] and last_row['sma_20'] > last_row['sma_50']:
            signals["ma"] = "Güçlü Al"
        elif last_row['close'] > last_row['sma_20']:
            signals["ma"] = "Al"
        elif last_row['close'] < last_row['sma_20'] and last_row['sma_20'] < last_row['sma_50']:
            signals["ma"] = "Güçlü Sat"
        elif last_row['close'] < last_row['sma_20']:
            signals["ma"] = "Sat"
            
        # MACD sinyali
        if last_row['macd'] > last_row['macd_signal'] and last_row['macd'] > 0:
            signals["macd"] = "Al"
        elif last_row['macd'] < last_row['macd_signal'] and last_row['macd'] < 0:
            signals["macd"] = "Sat"
        elif last_row['macd'] > last_row['macd_signal']:
            signals["macd"] = "Nötr/Al"
        else:
            signals["macd"] = "Nötr/Sat"
            
        # RSI sinyali
        if last_row['rsi_14'] > 70:
            signals["rsi"] = "Aşırı Alım (Sat)"
        elif last_row['rsi_14'] < 30:
            signals["rsi"] = "Aşırı Satım (Al)"
        elif last_row['rsi_14'] > 50:
            signals["rsi"] = "Nötr/Yükseliş"
        else:
            signals["rsi"] = "Nötr/Düşüş"
        
        # Stochastic sinyali
        if last_row['stoch_k'] > 80 and last_row['stoch_d'] > 80:
            signals["stoch"] = "Aşırı Alım (Sat)"
        elif last_row['stoch_k'] < 20 and last_row['stoch_d'] < 20:
            signals["stoch"] = "Aşırı Satım (Al)"
        elif last_row['stoch_k'] > last_row['stoch_d']:
            signals["stoch"] = "Nötr/Yükseliş"
        else:
            signals["stoch"] = "Nötr/Düşüş"
            
        # Bollinger Bands sinyali
        if last_row['close'] > last_row['bollinger_upper']:
            signals["bollinger"] = "Aşırı Alım (Sat)"
        elif last_row['close'] < last_row['bollinger_lower']:
            signals["bollinger"] = "Aşırı Satım (Al)"
        elif last_row['close'] > last_row['bollinger_middle']:
            signals["bollinger"] = "Nötr/Yükseliş"
        else:
            signals["bollinger"] = "Nötr/Düşüş"
            
        return signals
    
    @staticmethod
    def identify_support_resistance(df: pd.DataFrame, window: int = 10) -> Dict[str, List[float]]:
        """
        Destek ve direnç seviyelerini belirler - crypto.py için uyumluluk
        """
        # Son satır
        last_close = df['close'].iloc[-1]
        
        # Minimum ve maksimum değerler
        highs = df['high'].rolling(window=window, center=True).max()
        lows = df['low'].rolling(window=window, center=True).min()
        
        # NaN değerleri kaldır
        highs = highs.dropna()
        lows = lows.dropna()
        
        # Son 100 veri noktası içindeki önemli seviyeler
        recent_highs = highs.tail(100).sort_values(ascending=False).unique()[:3]
        recent_lows = lows.tail(100).sort_values().unique()[:3]
        
        # Mevcut fiyata göre direnç ve destek seviyeleri
        resistance_levels = [level for level in recent_highs if level > last_close]
        support_levels = [level for level in recent_lows if level < last_close]
        
        # Sonuç
        return {
            "support": support_levels.tolist() if hasattr(support_levels, 'tolist') else list(support_levels),
            "resistance": resistance_levels.tolist() if hasattr(resistance_levels, 'tolist') else list(resistance_levels)
        }
    
    @staticmethod
    def sma(series: pd.Series, period: int) -> pd.Series:
        """Basit Hareketli Ortalama (SMA) hesaplar"""
        return series.rolling(window=period).mean()
    
    @staticmethod
    def ema(series: pd.Series, period: int) -> pd.Series:
        """Üssel Hareketli Ortalama (EMA) hesaplar"""
        return series.ewm(span=period, adjust=False).mean()
    
    @staticmethod
    def macd(series: pd.Series, fast_period: int = 12, slow_period: int = 26, signal_period: int = 9) -> Dict[str, pd.Series]:
        """
        MACD (Hareketli Ortalama Yakınsama/Iraksama) hesaplar
        
        Returns:
            Dict: MACD, Signal ve Histogram değerlerini içeren sözlük
        """
        ema_fast = TechnicalIndicators.ema(series, fast_period)
        ema_slow = TechnicalIndicators.ema(series, slow_period)
        
        macd_line = ema_fast - ema_slow
        macd_signal = macd_line.ewm(span=signal_period, adjust=False).mean()
        macd_histogram = macd_line - macd_signal
        
        return {
            'macd': macd_line,
            'signal': macd_signal,
            'histogram': macd_histogram
        }
    
    @staticmethod
    def rsi(series: pd.Series, period: int = 14) -> pd.Series:
        """Göreceli Güç Endeksi (RSI) hesaplar"""
        # Günlük değişimler
        delta = series.diff()
        
        # Pozitif ve negatif değişimler
        gain = delta.where(delta > 0, 0)
        loss = -delta.where(delta < 0, 0)
        
        # İlk ortalamalar
        avg_gain = gain.rolling(window=period).mean()
        avg_loss = loss.rolling(window=period).mean()
        
        # Üssel ortalamalar (ilk değerleri döngü dışında hesapla)
        for i in range(period, len(series)):
            avg_gain.iloc[i] = (avg_gain.iloc[i-1] * (period-1) + gain.iloc[i]) / period
            avg_loss.iloc[i] = (avg_loss.iloc[i-1] * (period-1) + loss.iloc[i]) / period
        
        # RS ve RSI hesaplama
        rs = avg_gain / avg_loss
        rsi = 100 - (100 / (1 + rs))
        
        return rsi
    
    @staticmethod
    def bollinger_bands(series: pd.Series, period: int = 20, std_dev: int = 2) -> Dict[str, pd.Series]:
        """
        Bollinger Bantları hesaplar
        
        Returns:
            Dict: Üst, Orta ve Alt bantları içeren sözlük
        """
        middle_band = series.rolling(window=period).mean()
        std = series.rolling(window=period).std()
        
        upper_band = middle_band + (std * std_dev)
        lower_band = middle_band - (std * std_dev)
        
        return {
            'upper': upper_band,
            'middle': middle_band,
            'lower': lower_band
        }
    
    @staticmethod
    def stochastic(df: pd.DataFrame, k_period: int = 14, d_period: int = 3) -> Dict[str, pd.Series]:
        """
        Stokastik Osilatör hesaplar
        
        Returns:
            Dict: k ve d değerlerini içeren sözlük
        """
        # Belirlenen periyot içindeki en yüksek ve en düşük değerler
        low_min = df['low'].rolling(window=k_period).min()
        high_max = df['high'].rolling(window=k_period).max()
        
        # %K hesaplama: (Güncel Kapanış - En Düşük) / (En Yüksek - En Düşük) * 100
        k = 100 * ((df['close'] - low_min) / (high_max - low_min))
        
        # %D hesaplama: %K'nın d_period üzerinden SMA'sı
        d = k.rolling(window=d_period).mean()
        
        return {
            'k': k,
            'd': d
        }
    
    @staticmethod
    def atr(df: pd.DataFrame, period: int = 14) -> pd.Series:
        """
        Ortalama Gerçek Aralık (ATR) hesaplar
        
        Returns:
            pd.Series: ATR değerleri
        """
        high = df['high']
        low = df['low']
        close = df['close']
        
        # Gerçek Aralık hesaplama
        tr1 = high - low
        tr2 = (high - close.shift()).abs()
        tr3 = (low - close.shift()).abs()
        
        tr = pd.concat([tr1, tr2, tr3], axis=1).max(axis=1)
        
        # ATR hesaplama
        atr = tr.rolling(window=period).mean()
        
        return atr
    
    @staticmethod
    def obv(df: pd.DataFrame) -> pd.Series:
        """
        On-Balance Volume (OBV) hesaplar
        
        Returns:
            pd.Series: OBV değerleri
        """
        close = df['close']
        volume = df['volume']
        
        obv = pd.Series(index=df.index)
        obv.iloc[0] = 0
        
        for i in range(1, len(close)):
            if close.iloc[i] > close.iloc[i-1]:
                obv.iloc[i] = obv.iloc[i-1] + volume.iloc[i]
            elif close.iloc[i] < close.iloc[i-1]:
                obv.iloc[i] = obv.iloc[i-1] - volume.iloc[i]
            else:
                obv.iloc[i] = obv.iloc[i-1]
                
        return obv 