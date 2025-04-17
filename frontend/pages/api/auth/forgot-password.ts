import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { email } = req.body;

    // Validasyon
    if (!email) {
      return res.status(400).json({ message: 'E-posta adresi gereklidir' });
    }

    // Gerçek uygulamada e-posta gönderme işlemi yapılmalı
    console.log(`Şifre sıfırlama e-postası gönderildi: ${email}`);

    // Başarılı yanıt
    return res.status(200).json({
      success: true,
      message: 'Şifre sıfırlama bağlantısı e-posta adresinize gönderildi'
    });
  } catch (error) {
    console.error('Forgot Password API Error:', error);
    return res.status(500).json({ message: 'Sunucu hatası' });
  }
} 