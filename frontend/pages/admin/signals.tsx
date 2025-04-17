import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash, Plus, RefreshCw, Search, Filter } from 'lucide-react';

// Örnek sinyal verileri
const signalsData = [
  {
    id: 1,
    symbol: 'BTC',
    type: 'Alım',
    price: '63500',
    target: '68000',
    stopLoss: '61000',
    date: '2024-04-20',
    status: 'Aktif',
  },
  {
    id: 2,
    symbol: 'ETH',
    type: 'Alım',
    price: '3050',
    target: '3300',
    stopLoss: '2900',
    date: '2024-04-19',
    status: 'Aktif',
  },
  {
    id: 3,
    symbol: 'SOL',
    type: 'Satım',
    price: '145',
    target: '130',
    stopLoss: '155',
    date: '2024-04-18',
    status: 'Kapandı',
  },
  {
    id: 4,
    symbol: 'BNB',
    type: 'Alım',
    price: '550',
    target: '600',
    stopLoss: '520',
    date: '2024-04-17',
    status: 'Kapandı',
  },
  {
    id: 5,
    symbol: 'ADA',
    type: 'Satım',
    price: '0.45',
    target: '0.40',
    stopLoss: '0.48',
    date: '2024-04-16',
    status: 'İptal Edildi',
  },
];

export default function AdminSignalsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('hepsi');
  const [typeFilter, setTypeFilter] = useState<string>('hepsi');
  
  // Filtreleme işlemleri
  const filteredSignals = signalsData.filter(signal => {
    const matchesSearch = signal.symbol.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'hepsi' ? true : signal.status === statusFilter;
    const matchesType = typeFilter === 'hepsi' ? true : signal.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Sinyal Yönetimi</h1>
          <p className="text-gray-500">Kripto sinyallerini yönetin</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Yeni Sinyal Ekle
        </Button>
      </div>
      
      {/* Filtreler */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            placeholder="Sembol ara..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-4">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <div className="flex items-center">
                <Filter className="mr-2 h-4 w-4" />
                <span>{statusFilter === 'hepsi' ? 'Durum Filtresi' : statusFilter}</span>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="hepsi">Tüm Durumlar</SelectItem>
              <SelectItem value="Aktif">Aktif</SelectItem>
              <SelectItem value="Kapandı">Kapandı</SelectItem>
              <SelectItem value="İptal Edildi">İptal Edildi</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[180px]">
              <div className="flex items-center">
                <Filter className="mr-2 h-4 w-4" />
                <span>{typeFilter === 'hepsi' ? 'İşlem Tipi' : typeFilter}</span>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="hepsi">Tüm İşlemler</SelectItem>
              <SelectItem value="Alım">Alım</SelectItem>
              <SelectItem value="Satım">Satım</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="icon" onClick={() => {
            setSearchTerm('');
            setStatusFilter('hepsi');
            setTypeFilter('hepsi');
          }}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Sinyal Tablosu */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Sinyaller</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b">
                  <th className="p-4 font-medium">SEMBOL</th>
                  <th className="p-4 font-medium">İŞLEM TİPİ</th>
                  <th className="p-4 font-medium">GİRİŞ FİYATI</th>
                  <th className="p-4 font-medium">HEDEF</th>
                  <th className="p-4 font-medium">STOP LOSS</th>
                  <th className="p-4 font-medium">TARİH</th>
                  <th className="p-4 font-medium">DURUM</th>
                  <th className="p-4 font-medium">İŞLEMLER</th>
                </tr>
              </thead>
              <tbody>
                {filteredSignals.map((signal) => (
                  <tr key={signal.id} className="border-b">
                    <td className="p-4 font-medium">{signal.symbol}</td>
                    <td className="p-4">
                      <Badge 
                        className={signal.type === 'Alım' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                      >
                        {signal.type}
                      </Badge>
                    </td>
                    <td className="p-4">${signal.price}</td>
                    <td className="p-4">${signal.target}</td>
                    <td className="p-4">${signal.stopLoss}</td>
                    <td className="p-4">{signal.date}</td>
                    <td className="p-4">
                      <Badge 
                        className={
                          signal.status === 'Aktif' 
                            ? 'bg-blue-100 text-blue-800' 
                            : signal.status === 'Kapandı' 
                              ? 'bg-gray-100 text-gray-800' 
                              : 'bg-yellow-100 text-yellow-800'
                        }
                      >
                        {signal.status}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                
                {filteredSignals.length === 0 && (
                  <tr>
                    <td colSpan={8} className="p-4 text-center text-gray-500">
                      Arama kriteriyle eşleşen sinyal bulunamadı.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 