import type { PropsWithChildren } from 'react';
import { cn } from '../../lib/cn';

export function Tabs({ className, children }: PropsWithChildren<{ className?: string }>) {
  return <div className={cn('border-b border-gray-200 dark:border-gray-800', className)}>{children}</div>;
}

export function TabList({ className, children }: PropsWithChildren<{ className?: string }>) {
  return <div className={cn('-mb-px flex gap-4', className)}>{children}</div>;
}

export function Tab({ active, className, children }: PropsWithChildren<{ active?: boolean; className?: string }>) {
  return (
    <button className={cn('border-b-2 px-3 py-2 text-sm font-medium', active ? 'border-blue-600 text-blue-600 dark:text-blue-400' : 'border-transparent text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white', className)}>
      {children}
    </button>
  );
}


