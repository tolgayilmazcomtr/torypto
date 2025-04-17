import { useSymbolPrices } from '@/hooks/useCrypto';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface SymbolCardProps {
  symbol: string;
}

export function SymbolCard({ symbol }: SymbolCardProps) {
  const { prices, loading, error } = useSymbolPrices(symbol, 5000);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-6 w-24" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-32" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          {error.message || 'Fiyat bilgisi alınamadı'}
        </AlertDescription>
      </Alert>
    );
  }

  const symbolPrice = prices.find((price) => price.symbol === symbol);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{symbol}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {symbolPrice?.price || 'N/A'}
        </div>
      </CardContent>
    </Card>
  );
} 