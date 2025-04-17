import { NextApiRequest, NextApiResponse } from 'next';
import { mockDb } from '@/lib/mock-data';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Sadece geliştirme ortamında erişilebilir olmalı
  if (process.env.NODE_ENV !== 'development') {
    return res.status(403).json({ message: 'Bu endpoint sadece geliştirme ortamında kullanılabilir' });
  }

  try {
    // Kullanıcıları sıfırla
    mockDb.resetUsers();

    // Başarılı yanıt
    return res.status(200).json({
      success: true,
      message: 'Kullanıcılar başarıyla sıfırlandı'
    });
  } catch (error) {
    console.error('Reset API Error:', error);
    return res.status(500).json({ message: 'Sunucu hatası' });
  }
} 