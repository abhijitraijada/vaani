import type { PropsWithChildren, TableHTMLAttributes } from 'react';
import { cn } from '../../lib/cn';

export function Table({ className, children, ...props }: PropsWithChildren<TableHTMLAttributes<HTMLTableElement>>) {
  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800">
      <table className={cn('min-w-full divide-y divide-gray-200 dark:divide-gray-800', className)} {...props}>
        {children}
      </table>
    </div>
  );
}

export function THead({ children }: PropsWithChildren) {
  return <thead className="bg-gray-50 dark:bg-gray-900/40">{children}</thead>;
}

export function TBody({ children }: PropsWithChildren) {
  return <tbody className="divide-y divide-gray-200 dark:divide-gray-800">{children}</tbody>;
}

export function TR({ children, variant = 'body' }: PropsWithChildren<{ variant?: 'head' | 'body' }>) {
  return (
    <tr className={variant === 'body' ? 'hover:bg-gray-50 dark:hover:bg-gray-900/40' : undefined}>
      {children}
    </tr>
  );
}

export function TH({ children, align = 'left' }: PropsWithChildren<{ align?: 'left' | 'center' | 'right' }>) {
  const alignClass = align === 'center' ? 'text-center' : align === 'right' ? 'text-right' : 'text-left';
  return <th className={cn('px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400', alignClass)}>{children}</th>;
}

export function TD({ children, align = 'left' }: PropsWithChildren<{ align?: 'left' | 'center' | 'right' }>) {
  const alignClass = align === 'center' ? 'text-center' : align === 'right' ? 'text-right' : 'text-left';
  return <td className={cn('px-4 py-3 text-sm text-gray-700 dark:text-gray-300', alignClass)}>{children}</td>;
}


