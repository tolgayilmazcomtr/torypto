import pandas as pd
import numpy as np
import talib
from typing import Dict, List, Tuple, Optional, Any

class TechnicalIndicators:
    """
    Teknik analiz göstergeleri için yardımcı sınıf.
    Çeşitli teknik göstergeleri hesaplar ve trend/sinyal analizleri yapar.
    """
    
    @staticmethod
    def add_all_indicators(df: pd.DataFrame) -> pd.DataFrame:
        """
        DataFrame'e tüm teknik göstergeleri ekler
        
        Args:
            df: OHLCV verilerini içeren DataFrame
                
        Returns:
            Göstergelerin eklendiği DataFrame
        """
        df = df.copy()
        
        # Moving Averages
        df['ma7'] = talib.SMA(df['close'], timeperiod=7)
        df['ma25'] = talib.SMA(df['close'], timeperiod=25)
        df['ma99'] = talib.SMA(df['close'], timeperiod=99)
        df['ema7'] = talib.EMA(df['close'], timeperiod=7)
        df['ema25'] = talib.EMA(df['close'], timeperiod=25)
        df['ema99'] = talib.EMA(df['close'], timeperiod=99)
        
        # RSI
        df['rsi'] = talib.RSI(df['close'], timeperiod=14)
        
        # MACD
        macd, macd_signal, macd_hist = talib.MACD(df['close'], 
                                                  fastperiod=12, 
                                                  slowperiod=26, 
                                                  signalperiod=9)
        df['macd'] = macd
        df['macd_signal'] = macd_signal
        df['macd_hist'] = macd_hist
        
        # Bollinger Bands
        upper, middle, lower = talib.BBANDS(df['close'], 
                                           timeperiod=20, 
                                           nbdevup=2, 
                                           nbdevdn=2, 
                                           matype=0)
        df['bb_upper'] = upper
        df['bb_middle'] = middle
        df['bb_lower'] = lower
        
        # ATR - Average True Range
        df['atr'] = talib.ATR(df['high'], df['low'], df['close'], timeperiod=14)
        
        # Stochastic
        slowk, slowd = talib.STOCH(df['high'], df['low'], df['close'], 
                                  fastk_period=14, 
                                  slowk_period=3, 
                                  slowk_matype=0, 
                                  slowd_period=3, 
                                  slowd_matype=0)
        df['stoch_k'] = slowk
        df['stoch_d'] = slowd
        
        # ADX - Trend strength
        df['adx'] = talib.ADX(df['high'], df['low'], df['close'], timeperiod=14)
        
        # CCI - Commodity Channel Index
        df['cci'] = talib.CCI(df['high'], df['low'], df['close'], timeperiod=14)
        
        # OBV - On Balance Volume
        df['obv'] = talib.OBV(df['close'], df['volume'])
        
        # VWAP - Volume Weighted Average Price (günlük hesaplama)
        df['vwap'] = TechnicalIndicators._calculate_vwap(df)
        
        # Ichimoku Cloud
        ichimoku = TechnicalIndicators._calculate_ichimoku(df)
        df = pd.concat([df, ichimoku], axis=1)
        
        return df
    
    @staticmethod
    def _calculate_vwap(df: pd.DataFrame) -> pd.Series:
        """
        VWAP (Volume Weighted Average Price) hesaplar
        """
        df = df.copy()
        # Günlük bazda VWAP hesapla
        df['vwap'] = (df['volume'] * (df['high'] + df['low'] + df['close']) / 3).cumsum() / df['volume'].cumsum()
        return df['vwap']
    
    @staticmethod
    def _calculate_ichimoku(df: pd.DataFrame) -> pd.DataFrame:
        """
        Ichimoku Cloud göstergelerini hesaplar
        """
        # Tenkan-sen (Conversion Line): (9-period high + 9-period low)/2
        nine_period_high = df['high'].rolling(window=9).max()
        nine_period_low = df['low'].rolling(window=9).min()
        tenkan_sen = (nine_period_high + nine_period_low) / 2
        
        # Kijun-sen (Base Line): (26-period high + 26-period low)/2
        period26_high = df['high'].rolling(window=26).max()
        period26_low = df['low'].rolling(window=26).min()
        kijun_sen = (period26_high + period26_low) / 2
        
        # Senkou Span A (Leading Span A): (Conversion Line + Base Line)/2
        senkou_span_a = ((tenkan_sen + kijun_sen) / 2).shift(26)
        
        # Senkou Span B (Leading Span B): (52-period high + 52-period low)/2
        period52_high = df['high'].rolling(window=52).max()
        period52_low = df['low'].rolling(window=52).min()
        senkou_span_b = ((period52_high + period52_low) / 2).shift(26)
        
        # Chikou Span (Lagging Span): Close price shifted -26 periods
        chikou_span = df['close'].shift(-26)
        
        return pd.DataFrame({
            'ichimoku_tenkan_sen': tenkan_sen,
            'ichimoku_kijun_sen': kijun_sen,
            'ichimoku_senkou_span_a': senkou_span_a,
            'ichimoku_senkou_span_b': senkou_span_b,
            'ichimoku_chikou_span': chikou_span
        }, index=df.index)
    
    @staticmethod
    def get_trend(df: pd.DataFrame) -> Dict[str, Any]:
        """
        Verilere göre mevcut trend analizi yapar
        
        Args:
            df: Teknik göstergeleri içeren DataFrame
                
        Returns:
            Trend analizi içeren sözlük
        """
        # Son satırı al
        last = df.iloc[-1]
        prev = df.iloc[-2] if len(df) > 1 else last
        
        # Trend belirlemesi
        ma_trend = "yükseliş" if last['ma7'] > last['ma25'] else "düşüş"
        ema_trend = "yükseliş" if last['ema7'] > last['ema25'] else "düşüş"
        
        # RSI durumu
        rsi_status = "aşırı alım" if last['rsi'] > 70 else "aşırı satım" if last['rsi'] < 30 else "nötr"
        
        # MACD durumu
        macd_trend = "yükseliş" if last['macd'] > last['macd_signal'] else "düşüş"
        macd_cross = "alttan yukarı" if last['macd'] > last['macd_signal'] and prev['macd'] <= prev['macd_signal'] else \
                     "üstten aşağı" if last['macd'] < last['macd_signal'] and prev['macd'] >= prev['macd_signal'] else "yok"
        
        # Bollinger Bands durumu
        bb_status = "üst banda yakın" if last['close'] > (last['bb_upper'] - (last['bb_upper'] - last['bb_middle'])/3) else \
                   "alt banda yakın" if last['close'] < (last['bb_lower'] + (last['bb_middle'] - last['bb_lower'])/3) else "ortalamada"
        
        # Stochastic durumu
        stoch_status = "aşırı alım" if last['stoch_k'] > 80 and last['stoch_d'] > 80 else \
                       "aşırı satım" if last['stoch_k'] < 20 and last['stoch_d'] < 20 else "nötr"
        
        # ADX trend gücü
        adx_strength = "güçlü" if last['adx'] > 25 else "zayıf"
        
        # CCI durumu
        cci_status = "aşırı alım" if last['cci'] > 100 else "aşırı satım" if last['cci'] < -100 else "nötr"
        
        # Ichimoku analizi
        ichimoku_cloud = "yükseliş" if last['close'] > last['ichimoku_senkou_span_a'] and \
                                      last['close'] > last['ichimoku_senkou_span_b'] else \
                        "düşüş" if last['close'] < last['ichimoku_senkou_span_a'] and \
                                  last['close'] < last['ichimoku_senkou_span_b'] else "kararsız"
        
        # Genel trend
        bullish_indicators = sum([
            1 if ma_trend == "yükseliş" else 0,
            1 if ema_trend == "yükseliş" else 0,
            1 if macd_trend == "yükseliş" else 0,
            1 if rsi_status != "aşırı alım" and last['rsi'] > 50 else 0,
            1 if stoch_status != "aşırı alım" and last['stoch_k'] > last['stoch_d'] else 0,
            1 if ichimoku_cloud == "yükseliş" else 0,
            1 if last['adx'] > 25 and last['close'] > last['ma25'] else 0
        ])
        
        bearish_indicators = sum([
            1 if ma_trend == "düşüş" else 0,
            1 if ema_trend == "düşüş" else 0,
            1 if macd_trend == "düşüş" else 0,
            1 if rsi_status != "aşırı satım" and last['rsi'] < 50 else 0,
            1 if stoch_status != "aşırı satım" and last['stoch_k'] < last['stoch_d'] else 0,
            1 if ichimoku_cloud == "düşüş" else 0,
            1 if last['adx'] > 25 and last['close'] < last['ma25'] else 0
        ])
        
        overall_trend = "güçlü yükseliş" if bullish_indicators >= 5 else \
                        "yükseliş" if bullish_indicators >= 4 else \
                        "güçlü düşüş" if bearish_indicators >= 5 else \
                        "düşüş" if bearish_indicators >= 4 else \
                        "nötr"
                        
        return {
            "overall": overall_trend,
            "ma_trend": ma_trend,
            "ema_trend": ema_trend,
            "rsi_status": rsi_status,
            "macd_trend": macd_trend,
            "macd_cross": macd_cross,
            "bb_status": bb_status,
            "stoch_status": stoch_status,
            "adx_strength": adx_strength,
            "cci_status": cci_status,
            "ichimoku_cloud": ichimoku_cloud,
            "bullish_score": bullish_indicators,
            "bearish_score": bearish_indicators
        }
    
    @staticmethod
    def get_signals(df: pd.DataFrame) -> Dict[str, str]:
        """
        Mevcut veri setinden alım/satım sinyalleri üretir
        
        Args:
            df: Teknik göstergeleri içeren DataFrame
                
        Returns:
            Sinyal analizleri içeren sözlük
        """
        # Son iki satırı al (şu anki ve önceki durum için)
        if len(df) < 2:
            return {"error": "Sinyal analizi için en az 2 veri noktası gerekli"}
            
        cur = df.iloc[-1]  # Şu anki
        prev = df.iloc[-2]  # Önceki
        
        signals = {}
        
        # MACD Sinyali
        if prev['macd'] < prev['macd_signal'] and cur['macd'] > cur['macd_signal']:
            signals['macd'] = "AL"
        elif prev['macd'] > prev['macd_signal'] and cur['macd'] < cur['macd_signal']:
            signals['macd'] = "SAT"
        else:
            signals['macd'] = "BEKLE"
            
        # RSI Sinyali
        if cur['rsi'] < 30:
            signals['rsi'] = "AL"
        elif cur['rsi'] > 70:
            signals['rsi'] = "SAT"
        else:
            signals['rsi'] = "BEKLE"
            
        # Bollinger Bands Sinyali
        if cur['close'] < cur['bb_lower']:
            signals['bollinger'] = "AL"
        elif cur['close'] > cur['bb_upper']:
            signals['bollinger'] = "SAT"
        else:
            signals['bollinger'] = "BEKLE"
            
        # Stochastic Sinyali
        if prev['stoch_k'] < prev['stoch_d'] and cur['stoch_k'] > cur['stoch_d'] and cur['stoch_k'] < 20:
            signals['stochastic'] = "AL"
        elif prev['stoch_k'] > prev['stoch_d'] and cur['stoch_k'] < cur['stoch_d'] and cur['stoch_k'] > 80:
            signals['stochastic'] = "SAT"
        else:
            signals['stochastic'] = "BEKLE"
            
        # Hareketli Ortalama Sinyali (MA Cross)
        if prev['ma7'] < prev['ma25'] and cur['ma7'] > cur['ma25']:
            signals['ma_cross'] = "AL"
        elif prev['ma7'] > prev['ma25'] and cur['ma7'] < cur['ma25']:
            signals['ma_cross'] = "SAT"
        else:
            signals['ma_cross'] = "BEKLE"
            
        # Birleşik Sinyal
        al_sinyaller = sum(1 for signal in signals.values() if signal == "AL")
        sat_sinyaller = sum(1 for signal in signals.values() if signal == "SAT")
        
        if al_sinyaller >= 3:
            signals['combined'] = "GÜÇLÜ AL"
        elif al_sinyaller >= 2:
            signals['combined'] = "AL"
        elif sat_sinyaller >= 3:
            signals['combined'] = "GÜÇLÜ SAT"
        elif sat_sinyaller >= 2:
            signals['combined'] = "SAT"
        else:
            signals['combined'] = "BEKLE"
            
        return signals
    
    @staticmethod
    def identify_support_resistance(df: pd.DataFrame, window: int = 10) -> Dict[str, List[float]]:
        """
        Destek ve direnç seviyelerini belirler
        
        Args:
            df: OHLCV verileri içeren DataFrame
            window: İncelenecek komşu nokta sayısı
                
        Returns:
            Destek ve direnç seviyelerini içeren sözlük
        """
        if len(df) < window * 2:
            return {"support": [], "resistance": []}
            
        # Yüksek ve düşük değerlerden pivot noktaları belirleme
        df = df.copy()  # orijinal dataframe'i değiştirmeden
        
        # Pivot yüksek ve düşük noktaları belirle
        pivot_high = np.zeros(len(df))
        pivot_low = np.zeros(len(df))
        
        for i in range(window, len(df) - window):
            # Önceki ve sonraki "window" kadar noktayı kontrol et
            if df['high'].iloc[i] > df['high'].iloc[i-window:i].max() and \
               df['high'].iloc[i] > df['high'].iloc[i+1:i+window+1].max():
                pivot_high[i] = df['high'].iloc[i]
                
            if df['low'].iloc[i] < df['low'].iloc[i-window:i].min() and \
               df['low'].iloc[i] < df['low'].iloc[i+1:i+window+1].min():
                pivot_low[i] = df['low'].iloc[i]
        
        # Pivot noktalarını al
        resistance_levels = [level for level in pivot_high if level > 0]
        support_levels = [level for level in pivot_low if level > 0]
        
        # Yakın seviyeleri gruplandır (benzer seviyeleri birleştir)
        def group_levels(levels, threshold=0.02):
            if not levels:
                return []
                
            # Önce sırala
            sorted_levels = sorted(levels)
            grouped = []
            current_group = [sorted_levels[0]]
            
            for i in range(1, len(sorted_levels)):
                # Eğer önceki seviyeye göre %threshold'dan daha yakınsa aynı gruba ekle
                if (sorted_levels[i] - current_group[-1]) / current_group[0] < threshold:
                    current_group.append(sorted_levels[i])
                else:
                    # Grubun ortalamasını al
                    grouped.append(sum(current_group) / len(current_group))
                    # Yeni grup başlat
                    current_group = [sorted_levels[i]]
            
            # Son grubu ekle
            if current_group:
                grouped.append(sum(current_group) / len(current_group))
                
            return grouped
        
        # Son fiyat
        last_price = df['close'].iloc[-1]
        
        # Seviyeleri gruplandır
        grouped_resistance = group_levels(resistance_levels)
        grouped_support = group_levels(support_levels)
        
        # Son fiyata yakın olan destek ve dirençleri filtrele
        close_resistance = [r for r in grouped_resistance if r > last_price]
        close_support = [s for s in grouped_support if s < last_price]
        
        # En yakın 3 destek ve direnç seviyesini al
        close_resistance.sort()
        close_support.sort(reverse=True)
        
        return {
            "support": close_support[:3],
            "resistance": close_resistance[:3]
        } 