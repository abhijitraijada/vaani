import type { PropsWithChildren, ReactNode } from 'react';
import { Container, Section, Flex } from '../primitives/Layout';
import { cn } from '../../lib/cn';

export function Header({ left, right }: { left?: ReactNode; right?: ReactNode }) {
  return (
    <Section className="py-4">
      <Container>
        <Flex className="items-center justify-between">
          <div className="min-w-0">{left}</div>
          <div className="shrink-0">{right}</div>
        </Flex>
      </Container>
    </Section>
  );
}

export function Footer({ children }: PropsWithChildren) {
  return (
    <footer className="mt-12 border-t border-gray-200 py-8 dark:border-gray-800">
      <Container>
        {children}
      </Container>
    </footer>
  );
}

export function Sidebar({ children, className }: PropsWithChildren<{ className?: string }>) {
  return <aside className={cn('h-full w-64 shrink-0 border-r border-gray-200 dark:border-gray-800', className)}>{children}</aside>;
}

export function AppShell({ header, sidebar, footer, children }: PropsWithChildren<{ header?: React.ReactNode; sidebar?: React.ReactNode; footer?: React.ReactNode }>) {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-gray-100">
      {header}
      <div className="mx-auto flex w-full max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:px-8">
        {sidebar}
        <main className="min-w-0 grow">{children}</main>
      </div>
      {footer}
    </div>
  );
}


