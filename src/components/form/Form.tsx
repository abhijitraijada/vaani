import type { PropsWithChildren, HTMLAttributes, ReactNode } from 'react';
import { cn } from '../../lib/cn';

export function Form({ className, children, ...props }: PropsWithChildren<HTMLAttributes<HTMLFormElement>>) {
  return (
    <form noValidate className={cn('space-y-6', className)} {...props}>
      {children}
    </form>
  );
}

export function FormSection({ title, description, className, children }: PropsWithChildren<{ title?: ReactNode; description?: ReactNode; className?: string }>) {
  return (
    <section className={cn('space-y-2', className)}>
      {title && <h2 className="text-lg font-semibold">{title}</h2>}
      {description && <p className="text-sm text-gray-500">{description}</p>}
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">{children}</div>
    </section>
  );
}

export function FormActions({ className, children }: PropsWithChildren<{ className?: string }>) {
  return <div className={cn('flex items-center justify-end gap-3', className)}>{children}</div>;
}


