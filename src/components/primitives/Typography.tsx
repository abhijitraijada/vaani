import { cn } from '../../lib/cn';
import type { PropsWithChildren, HTMLAttributes, AnchorHTMLAttributes } from 'react';

type BaseProps = PropsWithChildren<HTMLAttributes<HTMLElement>> & {
  className?: string;
};

export function Heading({ className, children, ...props }: BaseProps) {
  return (
    <h1 className={cn('font-bold tracking-tight text-gray-900 dark:text-gray-100', className)} {...props}>
      {children}
    </h1>
  );
}

export function Text({ className, children, ...props }: BaseProps) {
  return (
    <p className={cn(className, 'text-gray-700 dark:text-gray-300')} {...props}>
      {children}
    </p>
  );
}

export function Link({ className, children, ...props }: PropsWithChildren<AnchorHTMLAttributes<HTMLAnchorElement>>) {
  return (
    <a className={cn('text-blue-600 hover:underline dark:text-blue-400', className)} {...props}>
      {children}
    </a>
  );
}


