import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Authorization header'ını kontrol et
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Yetkilendirme hatası' });
    }

    // Token'ı al
    const token = authHeader.substring(7);
    if (!token) {
      return res.status(401).json({ message: 'Geçersiz token' });
    }

    try {
      // Token'ı decode et (gerçek uygulamada JWT doğrulaması yapılmalı)
      const userInfo = JSON.parse(Buffer.from(token, 'base64').toString());
      
      // Kullanıcı bilgilerini döndür
      return res.status(200).json(userInfo);
    } catch (error) {
      return res.status(401).json({ message: 'Geçersiz token formatı' });
    }
  } catch (error) {
    console.error('Me API Error:', error);
    return res.status(500).json({ message: 'Sunucu hatası' });
  }
} 