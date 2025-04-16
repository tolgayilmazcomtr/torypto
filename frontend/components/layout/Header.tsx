import React from 'react';
import { useTheme } from '@/hooks/useTheme';
import { MoonIcon, SunIcon, ComputerDesktopIcon, MagnifyingGlassIcon, BellIcon } from '@heroicons/react/24/outline';

type ThemeIconProps = {
  theme: 'light' | 'dark' | 'system';
  className?: string;
};

const ThemeIcon: React.FC<ThemeIconProps> = ({ theme, className }) => {
  switch (theme) {
    case 'light':
      return <SunIcon className={className} />;
    case 'dark':
      return <MoonIcon className={className} />;
    case 'system':
      return <ComputerDesktopIcon className={className} />;
  }
};

const Header: React.FC = () => {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    if (theme === 'dark') {
      setTheme('light');
    } else if (theme === 'light') {
      setTheme('system');
    } else {
      setTheme('dark');
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b bg-background px-4 md:px-6">
      <div className="flex items-center gap-2 md:gap-4">
        <div className="relative w-full max-w-md">
          <MagnifyingGlassIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            placeholder="Kripto ara veya sembol gir..."
            className="h-9 w-full rounded-md border border-input bg-background pl-8 pr-4 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-muted/30"
          />
        </div>
      </div>
      <div className="flex items-center gap-2 md:gap-4">
        <button
          onClick={toggleTheme}
          className="inline-flex h-9 w-9 items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
          title={`Geçerli tema: ${theme}`}
        >
          <ThemeIcon theme={theme} className="h-5 w-5" />
        </button>
        <button className="inline-flex h-9 w-9 items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
          <BellIcon className="h-5 w-5" />
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
            3
          </span>
        </button>
        <div className="flex items-center gap-2">
          <div className="relative h-8 w-8 overflow-hidden rounded-full bg-primary/20">
            <span className="flex h-full w-full items-center justify-center font-medium text-primary">
              TY
            </span>
          </div>
          <div className="hidden md:block">
            <div className="text-sm font-medium">Kullanıcı</div>
            <div className="text-xs text-muted-foreground">Ücretsiz Plan</div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 