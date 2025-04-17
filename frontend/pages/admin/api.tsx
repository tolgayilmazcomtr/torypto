import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
  Key, 
  RefreshCcw, 
  Clock, 
  Shield, 
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react';

// Mock veri
const apiKeys = [
  {
    id: '1',
    name: 'Production API Key',
    key: 'pk_live_123456789',
    status: 'active',
    created: '2024-01-01',
    lastUsed: '2024-03-15',
    requests: 15000,
    rateLimit: 1000
  },
  {
    id: '2',
    name: 'Test API Key',
    key: 'pk_test_987654321',
    status: 'active',
    created: '2024-02-01',
    lastUsed: '2024-03-14',
    requests: 5000,
    rateLimit: 500
  }
];

const endpoints = [
  {
    path: '/api/v1/signals',
    method: 'GET',
    status: 'healthy',
    avgResponse: '120ms',
    success: 99.9,
    requests: 10000
  },
  {
    path: '/api/v1/users',
    method: 'POST',
    status: 'healthy',
    avgResponse: '150ms',
    success: 99.5,
    requests: 5000
  },
  {
    path: '/api/v1/payments',
    method: 'POST',
    status: 'warning',
    avgResponse: '250ms',
    success: 98.5,
    requests: 3000
  }
];

export default function ApiManagementPage() {
  const [searchKey, setSearchKey] = useState('');
  const [searchEndpoint, setSearchEndpoint] = useState('');

  const filteredKeys = apiKeys.filter(key =>
    key.name.toLowerCase().includes(searchKey.toLowerCase()) ||
    key.key.toLowerCase().includes(searchKey.toLowerCase())
  );

  const filteredEndpoints = endpoints.filter(endpoint =>
    endpoint.path.toLowerCase().includes(searchEndpoint.toLowerCase())
  );

  return (
    <div className="container mx-auto py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">API Yönetimi</h1>
        <p className="text-gray-500 mt-2">
          API anahtarları ve endpoint izleme
        </p>
      </div>

      <div className="grid gap-6">
        {/* API Anahtarları */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>API Anahtarları</CardTitle>
              <Button>
                <Key className="h-4 w-4 mr-2" />
                Yeni API Anahtarı
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <Input
                placeholder="API anahtarı ara..."
                value={searchKey}
                onChange={(e) => setSearchKey(e.target.value)}
              />
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>İsim</TableHead>
                  <TableHead>API Anahtarı</TableHead>
                  <TableHead>Durum</TableHead>
                  <TableHead>Oluşturulma</TableHead>
                  <TableHead>Son Kullanım</TableHead>
                  <TableHead>İstekler</TableHead>
                  <TableHead>Rate Limit</TableHead>
                  <TableHead>İşlemler</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredKeys.map((key) => (
                  <TableRow key={key.id}>
                    <TableCell>{key.name}</TableCell>
                    <TableCell>
                      <code className="bg-gray-100 px-2 py-1 rounded">
                        {key.key}
                      </code>
                    </TableCell>
                    <TableCell>
                      <Badge variant={key.status === 'active' ? 'success' : 'destructive'}>
                        {key.status === 'active' ? 'Aktif' : 'Pasif'}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(key.created).toLocaleDateString('tr-TR')}</TableCell>
                    <TableCell>{new Date(key.lastUsed).toLocaleDateString('tr-TR')}</TableCell>
                    <TableCell>{key.requests.toLocaleString()}</TableCell>
                    <TableCell>{key.rateLimit}/dk</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <RefreshCcw className="h-4 w-4" />
                        </Button>
                        <Button variant="destructive" size="sm">
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* API Endpoints */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>API Endpoints</CardTitle>
              <Button variant="outline">
                <RefreshCcw className="h-4 w-4 mr-2" />
                Yenile
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <Input
                placeholder="Endpoint ara..."
                value={searchEndpoint}
                onChange={(e) => setSearchEndpoint(e.target.value)}
              />
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Endpoint</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Durum</TableHead>
                  <TableHead>Ort. Yanıt Süresi</TableHead>
                  <TableHead>Başarı Oranı</TableHead>
                  <TableHead>İstek Sayısı</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEndpoints.map((endpoint, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <code className="bg-gray-100 px-2 py-1 rounded">
                        {endpoint.path}
                      </code>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{endpoint.method}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          endpoint.status === 'healthy' 
                            ? 'success' 
                            : endpoint.status === 'warning' 
                              ? 'default' 
                              : 'destructive'
                        }
                      >
                        {endpoint.status === 'healthy' ? 'Sağlıklı' : 'Uyarı'}
                      </Badge>
                    </TableCell>
                    <TableCell>{endpoint.avgResponse}</TableCell>
                    <TableCell>%{endpoint.success}</TableCell>
                    <TableCell>{endpoint.requests.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* API İstatistikleri */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Toplam İstek
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">18,000</div>
              <p className="text-xs text-muted-foreground">
                Son 24 saat
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Başarı Oranı
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">99.5%</div>
              <p className="text-xs text-muted-foreground">
                Son 24 saat
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Ort. Yanıt Süresi
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">145ms</div>
              <p className="text-xs text-muted-foreground">
                Son 24 saat
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Rate Limit Aşımı
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">23</div>
              <p className="text-xs text-muted-foreground">
                Son 24 saat
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 