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
                        "kararsız"
        
        return {
            "ma_trend": ma_trend,
            "ema_trend": ema_trend,
            "rsi_status": rsi_status,
            "macd_trend": macd_trend,
            "macd_cross": macd_cross,
            "bollinger_bands": bb_status,
            "stochastic": stoch_status,
            "adx_strength": adx_strength,
            "cci_status": cci_status,
            "ichimoku_cloud": ichimoku_cloud,
            "overall_trend": overall_trend,
            "bullish_indicators": bullish_indicators,
            "bearish_indicators": bearish_indicators
        }
    
    @staticmethod
    def get_signals(df: pd.DataFrame) -> Dict[str, str]:
        """
        Alım-satım sinyalleri oluşturur
        
        Args:
            df: Teknik göstergeleri içeren DataFrame
                
        Returns:
            Alım-satım sinyallerini içeren sözlük
        """
        if len(df) < 3:
            return {"error": "Yeterli veri yok"}
        
        # Son verileri al
        last = df.iloc[-1]
        prev = df.iloc[-2]
        prev2 = df.iloc[-3]
        
        signals = {}
        
        # MA Crossover
        signals["ma_crossover"] = "AL" if prev['ma7'] <= prev['ma25'] and last['ma7'] > last['ma25'] else \
                                 "SAT" if prev['ma7'] >= prev['ma25'] and last['ma7'] < last['ma25'] else "YOK"
        
        # MACD Signal
        signals["macd"] = "AL" if prev['macd'] <= prev['macd_signal'] and last['macd'] > last['macd_signal'] else \
                         "SAT" if prev['macd'] >= prev['macd_signal'] and last['macd'] < last['macd_signal'] else "YOK"
        
        # RSI Signals
        signals["rsi"] = "AL" if prev['rsi'] < 30 and last['rsi'] >= 30 else \
                        "SAT" if prev['rsi'] > 70 and last['rsi'] <= 70 else "YOK"
        
        # Stochastic Signals
        signals["stochastic"] = "AL" if prev['stoch_k'] < 20 and last['stoch_k'] >= 20 and last['stoch_k'] > last['stoch_d'] else \
                               "SAT" if prev['stoch_k'] > 80 and last['stoch_k'] <= 80 and last['stoch_k'] < last['stoch_d'] else "YOK"
        
        # Bollinger Bands
        signals["bollinger"] = "AL" if prev['close'] <= prev['bb_lower'] and last['close'] > last['bb_lower'] else \
                              "SAT" if prev['close'] >= prev['bb_upper'] and last['close'] < last['bb_upper'] else "YOK"
        
        # Price Action - Support/Resistance Break
        # Bu basit bir örnek, gelişmiş destek/direnç tespiti daha karmaşık olabilir
        signals["price_action"] = "AL" if prev['close'] < prev['ma99'] and last['close'] > last['ma99'] else \
                                 "SAT" if prev['close'] > prev['ma99'] and last['close'] < last['ma99'] else "YOK"
        
        # Ichimoku Signals
        signals["ichimoku"] = "AL" if prev['close'] <= prev['ichimoku_kijun_sen'] and last['close'] > last['ichimoku_kijun_sen'] else \
                             "SAT" if prev['close'] >= prev['ichimoku_kijun_sen'] and last['close'] < last['ichimoku_kijun_sen'] else "YOK"
        
        # Birleşik sinyal (çoğunluk oylaması)
        buy_signals = sum(1 for signal in signals.values() if signal == "AL")
        sell_signals = sum(1 for signal in signals.values() if signal == "SAT")
        
        signals["overall"] = "GÜÇLÜ_AL" if buy_signals >= 3 and sell_signals == 0 else \
                            "AL" if buy_signals > sell_signals else \
                            "GÜÇLÜ_SAT" if sell_signals >= 3 and buy_signals == 0 else \
                            "SAT" if sell_signals > buy_signals else "NÖTR"
        
        return signals
    
    @staticmethod
    def identify_support_resistance(df: pd.DataFrame, window: int = 10) -> Dict[str, List[float]]:
        """
        Destek ve direnç seviyelerini tespit eder
        
        Args:
            df: OHLCV DataFrame
            window: Karşılaştırma için kullanılacak pencere boyutu
                
        Returns:
            Destek ve direnç seviyelerini içeren sözlük
        """
        if len(df) < window*2:
            return {"support": [], "resistance": []}
        
        # Yerel minimumları ve maksimumları bul
        df_min = df['low'].rolling(window=window, center=True).min()
        df_max = df['high'].rolling(window=window, center=True).max()
        
        supports = []
        resistances = []
        
        # Destek seviyeleri
        for i in range(window, len(df) - window):
            if df['low'].iloc[i] == df_min.iloc[i] and df['low'].iloc[i] not in supports:
                supports.append(round(df['low'].iloc[i], 2))
        
        # Direnç seviyeleri
        for i in range(window, len(df) - window):
            if df['high'].iloc[i] == df_max.iloc[i] and df['high'].iloc[i] not in resistances:
                resistances.append(round(df['high'].iloc[i], 2))
        
        # Mevcut fiyat
        current_price = df['close'].iloc[-1]
        
        # Fiyata yakın olan seviyeleri filtrele
        filtered_supports = [level for level in sorted(supports, reverse=True) if level < current_price][:3]
        filtered_resistances = [level for level in sorted(resistances) if level > current_price][:3]
        
        return {
            "support": filtered_supports,
            "resistance": filtered_resistances
        } 