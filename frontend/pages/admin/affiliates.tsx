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
  Users, 
  DollarSign, 
  Link as LinkIcon, 
  Percent,
  UserPlus,
  ArrowUpRight,
  LineChart
} from 'lucide-react';

// Mock veri
const affiliates = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    referralCode: 'JOHN2024',
    referrals: 25,
    earnings: 1250,
    commission: 10,
    status: 'active',
    joinDate: '2024-01-01'
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    referralCode: 'JANE2024',
    referrals: 15,
    earnings: 750,
    commission: 10,
    status: 'active',
    joinDate: '2024-02-01'
  }
];

const referrals = [
  {
    id: '1',
    affiliateId: '1',
    referredUser: 'Alice Brown',
    plan: 'Premium',
    amount: 99.99,
    commission: 10,
    status: 'completed',
    date: '2024-03-15'
  },
  {
    id: '2',
    affiliateId: '1',
    referredUser: 'Bob Wilson',
    plan: 'Basic',
    amount: 49.99,
    commission: 10,
    status: 'pending',
    date: '2024-03-14'
  }
];

export default function AffiliatesPage() {
  const [searchAffiliate, setSearchAffiliate] = useState('');
  const [searchReferral, setSearchReferral] = useState('');

  const filteredAffiliates = affiliates.filter(affiliate =>
    affiliate.name.toLowerCase().includes(searchAffiliate.toLowerCase()) ||
    affiliate.email.toLowerCase().includes(searchAffiliate.toLowerCase()) ||
    affiliate.referralCode.toLowerCase().includes(searchAffiliate.toLowerCase())
  );

  const filteredReferrals = referrals.filter(referral =>
    referral.referredUser.toLowerCase().includes(searchReferral.toLowerCase())
  );

  return (
    <div className="container mx-auto py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Affiliate Yönetimi</h1>
        <p className="text-gray-500 mt-2">
          Affiliate ortakları ve referanslar
        </p>
      </div>

      {/* İstatistikler */}
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Toplam Affiliate
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">150</div>
            <p className="text-xs text-muted-foreground">
              +12 bu ay
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Toplam Kazanç
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₺25,000</div>
            <p className="text-xs text-muted-foreground">
              +₺3,500 bu ay
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Toplam Referans
            </CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">450</div>
            <p className="text-xs text-muted-foreground">
              +45 bu ay
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Dönüşüm Oranı
            </CardTitle>
            <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15.5%</div>
            <p className="text-xs text-muted-foreground">
              +2.3% bu ay
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Affiliate Listesi */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Affiliate Ortakları</CardTitle>
            <Button>
              <UserPlus className="h-4 w-4 mr-2" />
              Yeni Affiliate
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Input
              placeholder="Affiliate ara..."
              value={searchAffiliate}
              onChange={(e) => setSearchAffiliate(e.target.value)}
            />
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>İsim</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Referans Kodu</TableHead>
                <TableHead>Referanslar</TableHead>
                <TableHead>Kazanç</TableHead>
                <TableHead>Komisyon</TableHead>
                <TableHead>Durum</TableHead>
                <TableHead>Katılım</TableHead>
                <TableHead>İşlemler</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAffiliates.map((affiliate) => (
                <TableRow key={affiliate.id}>
                  <TableCell>{affiliate.name}</TableCell>
                  <TableCell>{affiliate.email}</TableCell>
                  <TableCell>
                    <code className="bg-gray-100 px-2 py-1 rounded">
                      {affiliate.referralCode}
                    </code>
                  </TableCell>
                  <TableCell>{affiliate.referrals}</TableCell>
                  <TableCell>₺{affiliate.earnings}</TableCell>
                  <TableCell>%{affiliate.commission}</TableCell>
                  <TableCell>
                    <Badge variant={affiliate.status === 'active' ? 'success' : 'destructive'}>
                      {affiliate.status === 'active' ? 'Aktif' : 'Pasif'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(affiliate.joinDate).toLocaleDateString('tr-TR')}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <LinkIcon className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <LineChart className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Referans Listesi */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Son Referanslar</CardTitle>
            <Button variant="outline">
              <Percent className="h-4 w-4 mr-2" />
              Komisyonları Düzenle
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Input
              placeholder="Referans ara..."
              value={searchReferral}
              onChange={(e) => setSearchReferral(e.target.value)}
            />
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Referans</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Tutar</TableHead>
                <TableHead>Komisyon</TableHead>
                <TableHead>Durum</TableHead>
                <TableHead>Tarih</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReferrals.map((referral) => (
                <TableRow key={referral.id}>
                  <TableCell>{referral.referredUser}</TableCell>
                  <TableCell>{referral.plan}</TableCell>
                  <TableCell>₺{referral.amount}</TableCell>
                  <TableCell>%{referral.commission}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={referral.status === 'completed' ? 'success' : 'default'}
                    >
                      {referral.status === 'completed' ? 'Tamamlandı' : 'Beklemede'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(referral.date).toLocaleDateString('tr-TR')}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
} 