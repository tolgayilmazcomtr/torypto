import { NextPage } from 'next';

interface ErrorProps {
  statusCode?: number;
}

const Error: NextPage<ErrorProps> = ({ statusCode }) => {
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <h1 className="mb-4 text-2xl font-bold">
          {statusCode ? `${statusCode} - Hata` : 'Bir hata oluştu'}
        </h1>
        <p className="mb-6 text-muted-foreground">
          {statusCode
            ? `Sunucu tarafında ${statusCode} hata kodu ile karşılaşıldı.`
            : 'İstemci tarafında bir hata oluştu.'}
        </p>
        <button
          onClick={() => window.location.href = '/'}
          className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          Ana Sayfaya Dön
        </button>
      </div>
    </div>
  );
};

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error; 