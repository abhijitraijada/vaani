import type { PropsWithChildren } from 'react';

export function Breadcrumbs({ children }: PropsWithChildren) {
  return <nav className="text-sm text-gray-500 dark:text-gray-400">{children}</nav>;
}

export function Crumb({ children }: PropsWithChildren) {
  return <span className="after:mx-2 after:content-['/'] last:after:content-['']">{children}</span>;
}


