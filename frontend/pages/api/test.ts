import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // API URL
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    console.log('API URL:', API_URL);

    // Test isteği gönder
    const response = await axios.get(`${API_URL}/test/db`);
    
    // Yanıtı döndür
    res.status(200).json({
      success: true,
      apiResponse: response.data,
      message: 'API testi başarılı'
    });
  } catch (error: any) {
    console.error('API test hatası:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      details: error.response?.data || {},
      message: 'API testi başarısız oldu'
    });
  }
} 