import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  HomeIcon,
  ChartBarIcon,
  BellAlertIcon,
  WalletIcon,
  CogIcon,
  ArrowTrendingUpIcon,
  UserIcon,
  StarIcon,
} from '@heroicons/react/24/outline';

type NavItemProps = {
  href: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
};

const NavItem: React.FC<NavItemProps> = ({ href, icon, label, active }) => {
  return (
    <Link href={href}>
      <span
        className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-accent hover:text-accent-foreground ${
          active ? 'bg-accent text-accent-foreground font-medium' : 'text-muted-foreground'
        }`}
      >
        <span className="h-5 w-5">{icon}</span>
        <span>{label}</span>
      </span>
    </Link>
  );
};

const Sidebar: React.FC = () => {
  const router = useRouter();
  const path = router.pathname;

  const isActive = (href: string) => {
    return path === href || path.startsWith(`${href}/`);
  };

  return (
    <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 flex-col border-r bg-background md:flex">
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/">
          <span className="flex items-center gap-2 font-display text-xl font-bold">
            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
              <span className="text-lg font-bold text-primary-foreground">T</span>
            </span>
            <span>Torypto</span>
          </span>
        </Link>
      </div>
      <nav className="flex-1 overflow-auto p-4">
        <div className="space-y-1">
          <NavItem
            href="/"
            icon={<HomeIcon />}
            label="Gösterge Paneli"
            active={isActive('/')}
          />
          <NavItem
            href="/analysis"
            icon={<ChartBarIcon />}
            label="Analizler"
            active={isActive('/analysis')}
          />
          <NavItem
            href="/signals"
            icon={<ArrowTrendingUpIcon />}
            label="Sinyaller"
            active={isActive('/signals')}
          />
          <NavItem
            href="/favorites"
            icon={<StarIcon />}
            label="Favoriler"
            active={isActive('/favorites')}
          />
          <NavItem
            href="/notifications"
            icon={<BellAlertIcon />}
            label="Bildirimler"
            active={isActive('/notifications')}
          />
        </div>
        <div className="mt-8">
          <h3 className="mb-2 px-3 text-xs font-medium text-muted-foreground">Hesap</h3>
          <div className="space-y-1">
            <NavItem
              href="/profile"
              icon={<UserIcon />}
              label="Profil"
              active={isActive('/profile')}
            />
            <NavItem
              href="/subscription"
              icon={<WalletIcon />}
              label="Abonelik"
              active={isActive('/subscription')}
            />
            <NavItem
              href="/settings"
              icon={<CogIcon />}
              label="Ayarlar"
              active={isActive('/settings')}
            />
          </div>
        </div>
      </nav>
      <div className="border-t p-4">
        <div className="rounded-lg bg-muted p-4">
          <h4 className="mb-2 font-medium">Premium'a Yükselt</h4>
          <p className="mb-4 text-sm text-muted-foreground">
            Sınırsız analiz ve özel sinyaller için premium'a geçin.
          </p>
          <Link href="/subscription">
            <span className="inline-flex w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
              Premium Ol
            </span>
          </Link>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar; 