import React, { useState, useEffect } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { toast } from 'sonner';
import Image from 'next/image';

interface Symbol {
  id: string;
  name: string;
  symbol: string;
  icon: string;
  status: 'active' | 'inactive';
  type: 'crypto' | 'forex' | 'stock';
  lastUpdated: string;
}

// Mock veri
const mockSymbols: Symbol[] = [
  {
    id: '1',
    name: 'Bitcoin',
    symbol: 'BTC/USDT',
    icon: '/icons/btc.png',
    status: 'active',
    type: 'crypto',
    lastUpdated: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Ethereum',
    symbol: 'ETH/USDT',
    icon: '/icons/eth.png',
    status: 'active',
    type: 'crypto',
    lastUpdated: new Date().toISOString()
  }
];

export default function SymbolsPage() {
  const [symbols, setSymbols] = useState<Symbol[]>(mockSymbols);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSymbol, setSelectedSymbol] = useState<Symbol | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [newSymbol, setNewSymbol] = useState({
    name: '',
    symbol: '',
    icon: '',
    type: 'crypto',
    status: 'active'
  });

  // Sembol arama
  const filteredSymbols = symbols.filter(symbol => 
    symbol.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    symbol.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Yeni sembol ekleme
  const handleAddSymbol = () => {
    const symbol: Symbol = {
      id: String(symbols.length + 1),
      ...newSymbol,
      lastUpdated: new Date().toISOString()
    };
    setSymbols([...symbols, symbol]);
    setIsAddDialogOpen(false);
    setNewSymbol({
      name: '',
      symbol: '',
      icon: '',
      type: 'crypto',
      status: 'active'
    });
    toast.success('Sembol başarıyla eklendi');
  };

  // Sembol düzenleme
  const handleEditSymbol = () => {
    if (!selectedSymbol) return;
    const updatedSymbols = symbols.map(symbol => 
      symbol.id === selectedSymbol.id ? selectedSymbol : symbol
    );
    setSymbols(updatedSymbols);
    setIsEditDialogOpen(false);
    toast.success('Sembol başarıyla güncellendi');
  };

  // Sembol silme
  const handleDeleteSymbol = () => {
    if (!selectedSymbol) return;
    const updatedSymbols = symbols.filter(symbol => symbol.id !== selectedSymbol.id);
    setSymbols(updatedSymbols);
    setIsDeleteDialogOpen(false);
    toast.success('Sembol başarıyla silindi');
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Sembol Yönetimi</h1>
        <div className="flex gap-4">
          <Input
            placeholder="Sembol ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64"
          />
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>Yeni Sembol Ekle</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Yeni Sembol Ekle</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <Input
                  placeholder="Sembol Adı"
                  value={newSymbol.name}
                  onChange={(e) => setNewSymbol({...newSymbol, name: e.target.value})}
                />
                <Input
                  placeholder="Sembol (örn: BTC/USDT)"
                  value={newSymbol.symbol}
                  onChange={(e) => setNewSymbol({...newSymbol, symbol: e.target.value})}
                />
                <Input
                  placeholder="İkon URL"
                  value={newSymbol.icon}
                  onChange={(e) => setNewSymbol({...newSymbol, icon: e.target.value})}
                />
                <Select
                  value={newSymbol.type}
                  onValueChange={(value: any) => setNewSymbol({...newSymbol, type: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Tür seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="crypto">Kripto</SelectItem>
                    <SelectItem value="forex">Forex</SelectItem>
                    <SelectItem value="stock">Hisse</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={newSymbol.status}
                  onValueChange={(value: any) => setNewSymbol({...newSymbol, status: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Durum seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Aktif</SelectItem>
                    <SelectItem value="inactive">Pasif</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">İptal</Button>
                </DialogClose>
                <Button onClick={handleAddSymbol}>Ekle</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>İkon</TableHead>
            <TableHead>Ad</TableHead>
            <TableHead>Sembol</TableHead>
            <TableHead>Tür</TableHead>
            <TableHead>Durum</TableHead>
            <TableHead>Son Güncelleme</TableHead>
            <TableHead>İşlemler</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredSymbols.map((symbol) => (
            <TableRow key={symbol.id}>
              <TableCell>
                <Image
                  src={symbol.icon}
                  alt={symbol.name}
                  width={24}
                  height={24}
                  className="rounded-full"
                />
              </TableCell>
              <TableCell>{symbol.name}</TableCell>
              <TableCell>{symbol.symbol}</TableCell>
              <TableCell>
                <Badge variant={symbol.type === 'crypto' ? 'default' : 'secondary'}>
                  {symbol.type === 'crypto' ? 'Kripto' : symbol.type === 'forex' ? 'Forex' : 'Hisse'}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant={symbol.status === 'active' ? 'success' : 'destructive'}>
                  {symbol.status === 'active' ? 'Aktif' : 'Pasif'}
                </Badge>
              </TableCell>
              <TableCell>
                {new Date(symbol.lastUpdated).toLocaleDateString('tr-TR')}
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedSymbol(symbol)}
                      >
                        Düzenle
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Sembol Düzenle</DialogTitle>
                      </DialogHeader>
                      {selectedSymbol && (
                        <div className="grid gap-4 py-4">
                          <Input
                            placeholder="Sembol Adı"
                            value={selectedSymbol.name}
                            onChange={(e) => setSelectedSymbol({
                              ...selectedSymbol,
                              name: e.target.value
                            })}
                          />
                          <Input
                            placeholder="Sembol (örn: BTC/USDT)"
                            value={selectedSymbol.symbol}
                            onChange={(e) => setSelectedSymbol({
                              ...selectedSymbol,
                              symbol: e.target.value
                            })}
                          />
                          <Input
                            placeholder="İkon URL"
                            value={selectedSymbol.icon}
                            onChange={(e) => setSelectedSymbol({
                              ...selectedSymbol,
                              icon: e.target.value
                            })}
                          />
                          <Select
                            value={selectedSymbol.type}
                            onValueChange={(value: any) => setSelectedSymbol({
                              ...selectedSymbol,
                              type: value
                            })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Tür seçin" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="crypto">Kripto</SelectItem>
                              <SelectItem value="forex">Forex</SelectItem>
                              <SelectItem value="stock">Hisse</SelectItem>
                            </SelectContent>
                          </Select>
                          <Select
                            value={selectedSymbol.status}
                            onValueChange={(value: any) => setSelectedSymbol({
                              ...selectedSymbol,
                              status: value
                            })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Durum seçin" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="active">Aktif</SelectItem>
                              <SelectItem value="inactive">Pasif</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button variant="outline">İptal</Button>
                        </DialogClose>
                        <Button onClick={handleEditSymbol}>Güncelle</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                    <DialogTrigger asChild>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setSelectedSymbol(symbol)}
                      >
                        Sil
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Sembol Sil</DialogTitle>
                      </DialogHeader>
                      <p>
                        &quot;{selectedSymbol?.name}&quot; sembolünü silmek istediğinize emin misiniz?
                        Bu işlem geri alınamaz.
                      </p>
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button variant="outline">İptal</Button>
                        </DialogClose>
                        <Button variant="destructive" onClick={handleDeleteSymbol}>
                          Sil
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
} 