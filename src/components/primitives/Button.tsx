import type { ButtonHTMLAttributes, PropsWithChildren } from 'react';
import React from 'react';
import { cn } from '../../lib/cn';

type Variant = 'primary' | 'secondary' | 'destructive' | 'ghost' | 'icon';
type Size = 'sm' | 'md' | 'lg';

export type ButtonProps = PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement>
> & {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
};

const base = 'inline-flex items-center justify-center rounded-md font-medium transition-colors transition-transform duration-150 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
const sizes: Record<Size, string> = {
  sm: 'h-8 px-3 text-sm',
  md: 'h-10 px-4 text-base',
  lg: 'h-12 px-6 text-lg',
};

const variants: Record<Variant, string> = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-500',
  secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700',
  destructive: 'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500',
  ghost: 'bg-transparent text-gray-900 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-800',
  icon: 'bg-transparent text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 p-2 rounded-full',
};

export function Button({ variant = 'primary', size = 'md', loading = false, className, children, disabled, ...props }: ButtonProps) {
  const isDisabled = disabled || loading;
  return (
    <button
      className={cn(base, sizes[size], variants[variant], loading && 'relative pointer-events-none opacity-70', className)}
      aria-busy={loading || undefined}
      disabled={isDisabled}
      {...props}
    >
      {loading && (
        <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent align-[-2px]" />
      )}
      <span>{children}</span>
    </button>
  );
}

export function ButtonGroup({ className, children, fullWidth = false }: PropsWithChildren<{ className?: string; fullWidth?: boolean }>) {
  type WithClassName = { className?: string };
  const elements = (React.Children.toArray(children).filter(React.isValidElement) as unknown[] as React.ReactElement<WithClassName>[]);
  return (
    <div className={cn(fullWidth ? 'flex w-full' : 'inline-flex', 'overflow-hidden rounded-md border border-gray-300 dark:border-gray-700', className)}>
      {elements.map((child, index) => {
        const isFirst = index === 0;
        const injected = cn(
          'rounded-none focus-visible:z-10',
          isFirst ? 'border-0' : 'border-l border-gray-300 dark:border-gray-700',
        );
        return React.cloneElement(child, { className: cn(child.props.className, injected) });
      })}
    </div>
  );
}

// Segmented control was removed per requirements; ButtonGroup covers the visual grouping use case.


