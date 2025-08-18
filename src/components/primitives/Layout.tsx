import type { PropsWithChildren, HTMLAttributes } from 'react';
import { cn } from '../../lib/cn';

export function Container({ className, children, ...props }: PropsWithChildren<HTMLAttributes<HTMLDivElement>>) {
  return (
    <div className={cn('mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8', className)} {...props}>
      {children}
    </div>
  );
}

export function Section({ className, children, ...props }: PropsWithChildren<HTMLAttributes<HTMLElement>>) {
  return (
    <section className={cn('py-8 sm:py-12', className)} {...props}>
      {children}
    </section>
  );
}

export function Card({ className, children, ...props }: PropsWithChildren<HTMLAttributes<HTMLDivElement>>) {
  return (
    <div className={cn('rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900', className)} {...props}>
      {children}
    </div>
  );
}

export function Divider({ className, ...props }: HTMLAttributes<HTMLHRElement>) {
  return <hr className={cn('my-4 border-gray-200 dark:border-gray-800', className)} {...props} />;
}

export function Flex({ className, children, ...props }: PropsWithChildren<HTMLAttributes<HTMLDivElement>>) {
  return (
    <div className={cn('flex', className)} {...props}>
      {children}
    </div>
  );
}

export function Grid({ className, children, ...props }: PropsWithChildren<HTMLAttributes<HTMLDivElement>>) {
  return (
    <div className={cn('grid', className)} {...props}>
      {children}
    </div>
  );
}

export function Stack({ className, children, ...props }: PropsWithChildren<HTMLAttributes<HTMLDivElement>>) {
  return (
    <div className={cn('flex flex-col gap-3', className)} {...props}>
      {children}
    </div>
  );
}

export function Spacer({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('grow', className)} {...props} />;
}

export function Badge({ className, children, ...props }: PropsWithChildren<HTMLAttributes<HTMLSpanElement>>) {
  return (
    <span className={cn('inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300', className)} {...props}>
      {children}
    </span>
  );
}


