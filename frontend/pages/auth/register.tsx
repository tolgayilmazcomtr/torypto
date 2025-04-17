import { useState } from 'react';
import { useRouter } from 'next/router';
import { useAuthContext } from '@/contexts/AuthContext';
import AuthLayout from '@/components/layout/AuthLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Link from 'next/link';
import Spinner from '@/components/ui/spinner';

export default function RegisterPage() {
  const router = useRouter();
  const { register, error, loading: authLoading } = useAuthContext();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    // Form validasyonu
    if (!username || !email || !password) {
      setLocalError('Tüm alanları doldurunuz');
      return;
    }

    if (password.length < 6) {
      setLocalError('Şifre en az 6 karakter olmalıdır');
      return;
    }

    try {
      setLoading(true);
      console.log('Kayıt işlemi başlatılıyor:', { name: username, email, password: '*****' });
      await register(username, email, password);
      router.push('/dashboard');
    } catch (err) {
      console.error('Kayıt hatası:', err);
      setLocalError('Kayıt işlemi başarısız oldu. Lütfen bilgilerinizi kontrol edin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Kayıt Ol - Torypto">
      <div className="flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Kayıt Ol</CardTitle>
            <CardDescription className="text-center">
              Yeni hesap oluşturun veya{' '}
              <Link href="/auth/login" className="text-blue-500 hover:underline">
                giriş yapın
              </Link>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {(error || localError) && (
                <Alert variant="destructive">
                  <AlertDescription>{localError || error}</AlertDescription>
                </Alert>
              )}
              <div className="space-y-2">
                <Label htmlFor="username">Kullanıcı Adı</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  disabled={loading || authLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">E-posta</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading || authLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Şifre</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading || authLoading}
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading || authLoading}>
                {(loading || authLoading) && <Spinner size="sm" className="mr-2" />}
                {loading || authLoading ? 'Kayıt Yapılıyor...' : 'Kayıt Ol'}
              </Button>
            </form>
          </CardContent>
          <CardFooter>
            <p className="text-center w-full text-sm text-gray-600">
              Zaten hesabınız var mı?{' '}
              <Link href="/auth/login" className="text-blue-500 hover:underline">
                Giriş Yapın
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </AuthLayout>
  );
}

// Auth sayfaları ana layout'u kullanmamalı
RegisterPage.getLayout = (page: React.ReactNode) => page; 