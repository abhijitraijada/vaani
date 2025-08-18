import type { PropsWithChildren, ReactNode } from 'react';
import { cn } from '../lib/cn';

export type PageLayoutProps = PropsWithChildren<{
  title?: ReactNode;
  subtitle?: ReactNode;
  breadcrumbs?: ReactNode;
  tabs?: ReactNode;
  actions?: ReactNode;
  sidebar?: ReactNode;
  className?: string;
}>;

export function PageLayout({ title, subtitle, breadcrumbs, tabs, actions, sidebar, className, children }: PageLayoutProps) {
  return (
    <div className={cn('min-h-screen bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100', className)}>
      <div className="mx-auto w-full max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        {breadcrumbs && <div className="mb-2">{breadcrumbs}</div>}
        {(title || actions) && (
          <div className="mb-3 flex flex-wrap items-center gap-3">
            {title && (
              <div className="min-w-0">
                <h1 className="truncate text-2xl font-semibold leading-tight sm:text-3xl">{title}</h1>
                {subtitle && <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>}
              </div>
            )}
            <div className="ml-auto flex items-center gap-2">{actions}</div>
          </div>
        )}
        {tabs && <div className="mb-4">{tabs}</div>}
        <div className="flex gap-6">
          {sidebar && <aside className="hidden w-64 shrink-0 lg:block">{sidebar}</aside>}
          <main className="min-w-0 grow">{children}</main>
        </div>
      </div>
    </div>
  );
}


