import React from 'react';

export default function SignalsPage() {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold">Kripto Sinyalleri</h2>
        <p className="text-gray-500 mt-1">Aktif ve geçmiş sinyaller</p>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b">
                <th className="p-4 font-medium">İŞLEM TİPİ</th>
                <th className="p-4 font-medium">GİRİŞ FİYATI</th>
                <th className="p-4 font-medium">HEDEF</th>
                <th className="p-4 font-medium">STOP LOSS</th>
                <th className="p-4 font-medium">TARİH</th>
                <th className="p-4 font-medium">DURUM</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="p-4">
                  <span className="px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                    Alım
                  </span>
                </td>
                <td className="p-4">$61,250</td>
                <td className="p-4">$65,000</td>
                <td className="p-4">$58,500</td>
                <td className="p-4">18 Nisan 2024</td>
                <td className="p-4">
                  <span className="px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                    Aktif
                  </span>
                </td>
              </tr>
              <tr className="border-b">
                <td className="p-4">
                  <span className="px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                    Alım
                  </span>
                </td>
                <td className="p-4">$3,050</td>
                <td className="p-4">$3,300</td>
                <td className="p-4">$2,900</td>
                <td className="p-4">17 Nisan 2024</td>
                <td className="p-4">
                  <span className="px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                    Aktif
                  </span>
                </td>
              </tr>
              <tr>
                <td className="p-4">
                  <span className="px-3 py-1 rounded-full text-sm bg-red-100 text-red-800">
                    Satım
                  </span>
                </td>
                <td className="p-4">$145</td>
                <td className="p-4">$130</td>
                <td className="p-4">$155</td>
                <td className="p-4">16 Nisan 2024</td>
                <td className="p-4">
                  <span className="px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800">
                    Kapandı
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 