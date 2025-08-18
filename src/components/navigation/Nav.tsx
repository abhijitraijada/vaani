import type { PropsWithChildren } from 'react';
import { cn } from '../../lib/cn';

export function Navbar({ className, children }: PropsWithChildren<{ className?: string }>) {
  return <nav className={cn('flex items-center gap-4 p-4', className)}>{children}</nav>;
}

export function Menu({ className, children }: PropsWithChildren<{ className?: string }>) {
  return <ul className={cn('flex items-center gap-4', className)}>{children}</ul>;
}

export function MenuItem({ className, children }: PropsWithChildren<{ className?: string }>) {
  return <li className={cn('text-sm text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white', className)}>{children}</li>;
}

export function DropdownMenu({ trigger, children }: { trigger: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="relative inline-block">
      {trigger}
      <div className="absolute right-0 z-50 mt-2 w-48 rounded-md border border-gray-200 bg-white p-2 shadow-lg dark:border-gray-800 dark:bg-gray-900">
        {children}
      </div>
    </div>
  );
}


