import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Activity, 
  AlertCircle, 
  Database, 
  Cpu, 
  HardDrive,
  Network,
  Users
} from 'lucide-react';

// Mock veri
const systemMetrics = {
  cpu: {
    usage: 45,
    cores: 8,
    temperature: 65
  },
  memory: {
    total: 16,
    used: 8.5,
    free: 7.5
  },
  disk: {
    total: 500,
    used: 350,
    free: 150
  },
  network: {
    incoming: 150,
    outgoing: 75,
    latency: 25
  },
  users: {
    active: 250,
    total: 1000,
    newToday: 15
  },
  errors: {
    last24h: 5,
    critical: 1,
    warning: 4
  }
};

const MetricCard = ({ 
  title, 
  value, 
  subValue, 
  icon, 
  color 
}: { 
  title: string; 
  value: string | number; 
  subValue?: string; 
  icon: React.ReactNode; 
  color: string;
}) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">
        {title}
      </CardTitle>
      <div className={`${color} rounded-full p-2`}>
        {icon}
      </div>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      {subValue && (
        <p className="text-xs text-muted-foreground">
          {subValue}
        </p>
      )}
    </CardContent>
  </Card>
);

export default function MonitoringPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Sistem İzleme</h1>
        <p className="text-gray-500 mt-2">
          Sistem performansı ve kaynak kullanımı
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <MetricCard
          title="CPU Kullanımı"
          value={`${systemMetrics.cpu.usage}%`}
          subValue={`${systemMetrics.cpu.cores} Çekirdek | ${systemMetrics.cpu.temperature}°C`}
          icon={<Cpu className="h-4 w-4 text-white" />}
          color="bg-blue-500"
        />
        
        <MetricCard
          title="Bellek Kullanımı"
          value={`${systemMetrics.memory.used}GB / ${systemMetrics.memory.total}GB`}
          subValue={`${systemMetrics.memory.free}GB Boş`}
          icon={<Database className="h-4 w-4 text-white" />}
          color="bg-green-500"
        />

        <MetricCard
          title="Disk Kullanımı"
          value={`${systemMetrics.disk.used}GB / ${systemMetrics.disk.total}GB`}
          subValue={`${systemMetrics.disk.free}GB Boş`}
          icon={<HardDrive className="h-4 w-4 text-white" />}
          color="bg-yellow-500"
        />

        <MetricCard
          title="Ağ Trafiği"
          value={`${systemMetrics.network.incoming}MB/s Gelen`}
          subValue={`${systemMetrics.network.outgoing}MB/s Giden | ${systemMetrics.network.latency}ms Gecikme`}
          icon={<Network className="h-4 w-4 text-white" />}
          color="bg-purple-500"
        />

        <MetricCard
          title="Aktif Kullanıcılar"
          value={systemMetrics.users.active}
          subValue={`Toplam ${systemMetrics.users.total} | Bugün +${systemMetrics.users.newToday}`}
          icon={<Users className="h-4 w-4 text-white" />}
          color="bg-indigo-500"
        />

        <MetricCard
          title="Sistem Hataları"
          value={systemMetrics.errors.last24h}
          subValue={`${systemMetrics.errors.critical} Kritik | ${systemMetrics.errors.warning} Uyarı`}
          icon={<AlertCircle className="h-4 w-4 text-white" />}
          color="bg-red-500"
        />
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Sistem Aktivitesi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center">
                <Activity className="h-4 w-4 mr-2 text-green-500" />
                <span>API Sunucusu</span>
                <span className="ml-auto text-green-500">Çalışıyor</span>
              </div>
              <div className="flex items-center">
                <Activity className="h-4 w-4 mr-2 text-green-500" />
                <span>Veritabanı</span>
                <span className="ml-auto text-green-500">Çalışıyor</span>
              </div>
              <div className="flex items-center">
                <Activity className="h-4 w-4 mr-2 text-green-500" />
                <span>Web Sunucusu</span>
                <span className="ml-auto text-green-500">Çalışıyor</span>
              </div>
              <div className="flex items-center">
                <Activity className="h-4 w-4 mr-2 text-green-500" />
                <span>Cache Sunucusu</span>
                <span className="ml-auto text-green-500">Çalışıyor</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Son Hatalar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center">
                <AlertCircle className="h-4 w-4 mr-2 text-red-500" />
                <span>Veritabanı Bağlantı Hatası</span>
                <span className="ml-auto text-gray-500">2 saat önce</span>
              </div>
              <div className="flex items-center">
                <AlertCircle className="h-4 w-4 mr-2 text-yellow-500" />
                <span>Yüksek CPU Kullanımı</span>
                <span className="ml-auto text-gray-500">4 saat önce</span>
              </div>
              <div className="flex items-center">
                <AlertCircle className="h-4 w-4 mr-2 text-yellow-500" />
                <span>Bellek Kullanımı %90</span>
                <span className="ml-auto text-gray-500">6 saat önce</span>
              </div>
              <div className="flex items-center">
                <AlertCircle className="h-4 w-4 mr-2 text-red-500" />
                <span>API Rate Limit Aşıldı</span>
                <span className="ml-auto text-gray-500">8 saat önce</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 