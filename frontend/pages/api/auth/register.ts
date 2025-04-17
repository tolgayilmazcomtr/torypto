import { NextApiRequest, NextApiResponse } from 'next';
import { mockDb } from '@/lib/mock-data';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { name, email, password } = req.body;

    // Validasyon
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Tüm alanları doldurunuz' });
    }

    // Email kontrolü
    const existingUser = mockDb.findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'Bu e-posta adresi zaten kullanılıyor' });
    }

    // Yeni kullanıcı oluştur
    const newUser = mockDb.addUser({ name, email, password });

    // Kullanıcı bilgilerini döndür (şifre hariç)
    const { password: _, ...userWithoutPassword } = newUser;
    
    // Token oluştur (gerçek uygulamada JWT kullanılmalı)
    const token = Buffer.from(JSON.stringify(userWithoutPassword)).toString('base64');

    // Yanıt döndür
    return res.status(201).json({
      token,
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Register API Error:', error);
    return res.status(500).json({ message: 'Sunucu hatası' });
  }
} 