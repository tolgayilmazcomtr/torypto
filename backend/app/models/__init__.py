from sqlalchemy.orm import relationship
from .user import User
from .api_key import APIKey
from .trade import Trade
from .signal import Signal, UserSignal
from .watchlist import Watchlist

# User modeline ilişkileri ekle
User.api_keys = relationship("APIKey", back_populates="user")
User.trades = relationship("Trade", back_populates="user")
User.user_signals = relationship("UserSignal", back_populates="user")
User.watchlist_items = relationship("Watchlist", back_populates="user") 