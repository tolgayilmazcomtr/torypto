import pandas as pd
import numpy as np
from typing import Dict, Any, List, Tuple, Optional

class TechnicalIndicators:
    """
    Teknik analiz için çeşitli indikatörleri hesaplayan servis.
    """
    
    @staticmethod
    def calculate_sma(df: pd.DataFrame, period: int, column: str = 'close') -> pd.Series:
        """
        Basit Hareketli Ortalama (SMA) hesaplar.
        
        Args:
            df: Fiyat verileri içeren DataFrame
            period: SMA periyodu
            column: Hesaplanacak sütun adı
            
        Returns:
            SMA değerlerini içeren pandas Series
        """
        return df[column].rolling(window=period).mean()
    
    @staticmethod
    def calculate_ema(df: pd.DataFrame, period: int, column: str = 'close') -> pd.Series:
        """
        Üstel Hareketli Ortalama (EMA) hesaplar.
        
        Args:
            df: Fiyat verileri içeren DataFrame
            period: EMA periyodu
            column: Hesaplanacak sütun adı
            
        Returns:
            EMA değerlerini içeren pandas Series
        """
        return df[column].ewm(span=period, adjust=False).mean()
    
    @staticmethod
    def calculate_rsi(df: pd.DataFrame, period: int = 14, column: str = 'close') -> pd.Series:
        """
        Göreceli Güç Endeksi (RSI) hesaplar.
        
        Args:
            df: Fiyat verileri içeren DataFrame
            period: RSI periyodu
            column: Hesaplanacak sütun adı
            
        Returns:
            RSI değerlerini içeren pandas Series
        """
        delta = df[column].diff()
        gain = delta.clip(lower=0)
        loss = -delta.clip(upper=0)
        
        avg_gain = gain.rolling(window=period).mean()
        avg_loss = loss.rolling(window=period).mean()
        
        # İlk periyod sonrasında üstel ortalama kullan
        for i in range(period, len(df)):
            avg_gain.iloc[i] = (avg_gain.iloc[i-1] * (period-1) + gain.iloc[i]) / period
            avg_loss.iloc[i] = (avg_loss.iloc[i-1] * (period-1) + loss.iloc[i]) / period
        
        rs = avg_gain / avg_loss
        rsi = 100 - (100 / (1 + rs))
        return rsi
    
    @staticmethod
    def calculate_macd(df: pd.DataFrame, fast_period: int = 12, slow_period: int = 26, 
                       signal_period: int = 9, column: str = 'close') -> Dict[str, pd.Series]:
        """
        MACD (Moving Average Convergence Divergence) hesaplar.
        
        Args:
            df: Fiyat verileri içeren DataFrame
            fast_period: Hızlı EMA periyodu
            slow_period: Yavaş EMA periyodu
            signal_period: Sinyal çizgisi periyodu
            column: Hesaplanacak sütun adı
            
        Returns:
            MACD, Sinyal ve Histogram değerlerini içeren sözlük
        """
        fast_ema = df[column].ewm(span=fast_period, adjust=False).mean()
        slow_ema = df[column].ewm(span=slow_period, adjust=False).mean()
        
        macd = fast_ema - slow_ema
        signal = macd.ewm(span=signal_period, adjust=False).mean()
        histogram = macd - signal
        
        return {
            'macd': macd,
            'signal': signal,
            'histogram': histogram
        }
    
    @staticmethod
    def calculate_bollinger_bands(df: pd.DataFrame, period: int = 20, 
                                 std_dev: float = 2.0, column: str = 'close') -> Dict[str, pd.Series]:
        """
        Bollinger Bantları hesaplar.
        
        Args:
            df: Fiyat verileri içeren DataFrame
            period: SMA periyodu
            std_dev: Standart sapma çarpanı
            column: Hesaplanacak sütun adı
            
        Returns:
            Orta, Üst ve Alt bantları içeren sözlük
        """
        middle_band = df[column].rolling(window=period).mean()
        std = df[column].rolling(window=period).std()
        
        upper_band = middle_band + (std * std_dev)
        lower_band = middle_band - (std * std_dev)
        
        return {
            'middle': middle_band,
            'upper': upper_band,
            'lower': lower_band
        }
    
    @staticmethod
    def calculate_support_resistance(df: pd.DataFrame, window: int = 10, 
                                    precision: float = 0.5) -> Tuple[List[float], List[float]]:
        """
        Destek ve direnç seviyelerini hesaplar.
        
        Args:
            df: Fiyat verileri içeren DataFrame
            window: Yerel minimum ve maksimum bulmak için pencere boyutu
            precision: Fiyat hassasiyeti yüzdesi
            
        Returns:
            Destek ve direnç seviyelerini içeren tuple
        """
        supports = []
        resistances = []
        
        # Yerel minimumları bul
        df['min'] = df['low'].rolling(window=window, center=True).min()
        df['is_support'] = (df['min'] == df['low']) & (df['low'].shift(1) > df['low']) & (df['low'].shift(-1) > df['low'])
        
        # Yerel maksimumları bul
        df['max'] = df['high'].rolling(window=window, center=True).max()
        df['is_resistance'] = (df['max'] == df['high']) & (df['high'].shift(1) < df['high']) & (df['high'].shift(-1) < df['high'])
        
        # Destek seviyeleri
        support_levels = df[df['is_support'] == True]['low'].tolist()
        
        # Direnç seviyeleri
        resistance_levels = df[df['is_resistance'] == True]['high'].tolist()
        
        # Yakın seviyeleri filtrele
        if support_levels:
            supports.append(support_levels[0])
            for level in support_levels[1:]:
                if all(abs(level - s) / s > precision for s in supports):
                    supports.append(level)
        
        if resistance_levels:
            resistances.append(resistance_levels[0])
            for level in resistance_levels[1:]:
                if all(abs(level - r) / r > precision for r in resistances):
                    resistances.append(level)
        
        return supports, resistances
    
    @staticmethod
    def identify_trend(df: pd.DataFrame, period: int = 14) -> str:
        """
        Fiyat trendini belirler.
        
        Args:
            df: Fiyat verileri içeren DataFrame
            period: Trend değerlendirme periyodu
            
        Returns:
            "yükseliş", "düşüş" veya "yatay" olarak trend yönü
        """
        if len(df) < period:
            return "belirsiz"
        
        # Son 'period' kadar veriye bak
        recent_df = df.iloc[-period:]
        
        # EMA'ları hesapla
        ema20 = TechnicalIndicators.calculate_ema(recent_df, 20)
        ema50 = TechnicalIndicators.calculate_ema(recent_df, 50)
        
        # Son kapanış fiyatı
        last_close = recent_df['close'].iloc[-1]
        
        # Son EMA değerleri
        last_ema20 = ema20.iloc[-1]
        last_ema50 = ema50.iloc[-1]
        
        # Trend tespiti
        if last_close > last_ema20 and last_ema20 > last_ema50:
            return "yükseliş"
        elif last_close < last_ema20 and last_ema20 < last_ema50:
            return "düşüş"
        else:
            return "yatay"
    
    @staticmethod
    def generate_signals(df: pd.DataFrame) -> Dict[str, Any]:
        """
        Teknik indikatörlere dayalı alım-satım sinyalleri üretir.
        
        Args:
            df: Fiyat verileri içeren DataFrame
            
        Returns:
            Çeşitli sinyal bilgilerini içeren sözlük
        """
        signals = {}
        
        # RSI hesapla
        rsi = TechnicalIndicators.calculate_rsi(df)
        last_rsi = rsi.iloc[-1]
        
        if last_rsi < 30:
            signals["rsi"] = {"sinyal": "al", "değer": last_rsi, "açıklama": "Aşırı satım"}
        elif last_rsi > 70:
            signals["rsi"] = {"sinyal": "sat", "değer": last_rsi, "açıklama": "Aşırı alım"}
        else:
            signals["rsi"] = {"sinyal": "nötr", "değer": last_rsi, "açıklama": "Normal seviye"}
        
        # MACD hesapla
        macd_values = TechnicalIndicators.calculate_macd(df)
        last_macd = macd_values['macd'].iloc[-1]
        last_signal = macd_values['signal'].iloc[-1]
        last_histogram = macd_values['histogram'].iloc[-1]
        
        # MACD sinyali
        if last_macd > last_signal and last_histogram > 0:
            signals["macd"] = {"sinyal": "al", "değer": last_macd, "açıklama": "MACD sinyal çizgisini yukarı kesti"}
        elif last_macd < last_signal and last_histogram < 0:
            signals["macd"] = {"sinyal": "sat", "değer": last_macd, "açıklama": "MACD sinyal çizgisini aşağı kesti"}
        else:
            signals["macd"] = {"sinyal": "nötr", "değer": last_macd, "açıklama": "Belirgin sinyal yok"}
        
        # Bollinger Bantları hesapla
        bb = TechnicalIndicators.calculate_bollinger_bands(df)
        last_price = df['close'].iloc[-1]
        last_upper = bb['upper'].iloc[-1]
        last_lower = bb['lower'].iloc[-1]
        
        # Bollinger Bandı sinyali
        if last_price > last_upper:
            signals["bollinger"] = {"sinyal": "sat", "değer": last_price, "açıklama": "Fiyat üst bandın üzerinde"}
        elif last_price < last_lower:
            signals["bollinger"] = {"sinyal": "al", "değer": last_price, "açıklama": "Fiyat alt bandın altında"}
        else:
            signals["bollinger"] = {"sinyal": "nötr", "değer": last_price, "açıklama": "Fiyat bantlar arasında"}
        
        # Trend belirleme
        trend = TechnicalIndicators.identify_trend(df)
        signals["trend"] = {"yön": trend}
        
        # Genel sinyal oluştur
        buy_signals = sum(1 for sig in signals.values() if isinstance(sig, dict) and sig.get("sinyal") == "al")
        sell_signals = sum(1 for sig in signals.values() if isinstance(sig, dict) and sig.get("sinyal") == "sat")
        
        if buy_signals > sell_signals:
            signals["genel"] = "al"
        elif sell_signals > buy_signals:
            signals["genel"] = "sat"
        else:
            signals["genel"] = "nötr"
        
        return signals
    
    @staticmethod
    def analyze_market_data(df: pd.DataFrame) -> Dict[str, Any]:
        """
        Piyasa verilerinin kapsamlı bir analizini yapar.
        
        Args:
            df: Fiyat verileri içeren DataFrame
            
        Returns:
            Trend, sinyaller, destek/direnç seviyeleri ve indikatör verilerini içeren sözlük
        """
        # Son fiyat
        last_price = df['close'].iloc[-1] if not df.empty else None
        
        # Trend analizi
        trend = TechnicalIndicators.identify_trend(df)
        
        # Teknik indikatörler
        rsi = TechnicalIndicators.calculate_rsi(df)
        macd_values = TechnicalIndicators.calculate_macd(df)
        bollinger_bands = TechnicalIndicators.calculate_bollinger_bands(df)
        
        # Destek ve direnç seviyeleri
        supports, resistances = TechnicalIndicators.calculate_support_resistance(df)
        
        # Sinyaller
        signals = TechnicalIndicators.generate_signals(df)
        
        return {
            "price": last_price,
            "trend": trend,
            "signals": signals,
            "support_levels": supports,
            "resistance_levels": resistances,
            "indicators": {
                "rsi": rsi.iloc[-1] if not rsi.empty else None,
                "macd": {
                    "macd": macd_values['macd'].iloc[-1] if not macd_values['macd'].empty else None,
                    "signal": macd_values['signal'].iloc[-1] if not macd_values['signal'].empty else None,
                    "histogram": macd_values['histogram'].iloc[-1] if not macd_values['histogram'].empty else None
                },
                "bollinger_bands": {
                    "upper": bollinger_bands['upper'].iloc[-1] if not bollinger_bands['upper'].empty else None,
                    "middle": bollinger_bands['middle'].iloc[-1] if not bollinger_bands['middle'].empty else None,
                    "lower": bollinger_bands['lower'].iloc[-1] if not bollinger_bands['lower'].empty else None
                }
            }
        } 