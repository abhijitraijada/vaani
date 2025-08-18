import type { PropsWithChildren, ReactNode } from 'react';
import { useState } from 'react';
import { cn } from '../../lib/cn';

export function Tooltip({ label, children, className }: PropsWithChildren<{ label: ReactNode; className?: string }>) {
  const [open, setOpen] = useState(false);
  return (
    <span
      className={cn('relative inline-flex', className)}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {children}
      <span
        className={cn(
          'pointer-events-none absolute -top-2 left-1/2 z-50 -translate-x-1/2 -translate-y-full rounded bg-gray-900 px-2 py-1 text-xs text-white shadow transition-opacity duration-150',
          open ? 'opacity-100' : 'opacity-0'
        )}
      >
        {label}
      </span>
    </span>
  );
}


