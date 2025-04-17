import { NextApiRequest, NextApiResponse } from 'next';
import { mockDb } from '@/lib/mock-data';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { email, password } = req.body;

    // Validasyon
    if (!email || !password) {
      return res.status(400).json({ message: 'E-posta ve şifre gereklidir' });
    }

    // Kullanıcıyı bul
    const user = mockDb.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Geçersiz e-posta veya şifre' });
    }

    // Şifreyi kontrol et
    if (user.password !== password) {
      return res.status(401).json({ message: 'Geçersiz e-posta veya şifre' });
    }

    // Kullanıcı bilgilerini döndür (şifre hariç)
    const { password: _, ...userWithoutPassword } = user;
    
    // Token oluştur (gerçek uygulamada JWT kullanılmalı)
    const token = Buffer.from(JSON.stringify(userWithoutPassword)).toString('base64');

    // Son giriş zamanını güncelle
    mockDb.updateLastLogin(user.id);

    // Yanıt döndür
    return res.status(200).json({
      token,
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Login API Error:', error);
    return res.status(500).json({ message: 'Sunucu hatası' });
  }
} 