import React from 'react';
import { cn } from '@/lib/utils';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  fullScreen?: boolean;
  text?: string;
}

const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  className,
  fullScreen = false,
  text
}) => {
  // Spinner boyutları
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-3',
    lg: 'h-12 w-12 border-4',
  };

  // Spinner elementi
  const spinnerElement = (
    <div className={cn('relative flex flex-col items-center justify-center', fullScreen && 'h-full w-full')}>
      <div
        className={cn(
          'animate-spin rounded-full border-solid border-t-transparent',
          sizeClasses[size],
          'border-blue-600 dark:border-blue-400',
          className
        )}
      />
      
      {text && <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">{text}</p>}
    </div>
  );

  // Tam ekran veya normal görünüm
  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 dark:bg-gray-900/80">
        {spinnerElement}
      </div>
    );
  }

  return spinnerElement;
};

export default Spinner; 