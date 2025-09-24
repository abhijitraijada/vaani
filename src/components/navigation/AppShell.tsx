import type { PropsWithChildren, ReactNode } from 'react';
import { Container, Section, Flex } from '../primitives/Layout';
import { cn } from '../../lib/cn';
import { useState } from 'react';

export function Header({ left, right }: { left?: ReactNode; right?: ReactNode }) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleDrawer = () => setIsDrawerOpen(!isDrawerOpen);

  return (
    <>
      <Section className="py-4">
        <Container>
          <Flex className="items-center justify-between">
            {/* Desktop: Show left and right components */}
            <div className="hidden lg:flex min-w-0">{left}</div>
            <div className="hidden lg:flex shrink-0">{right}</div>
            
            {/* Mobile: Show burger menu on left, no title */}
            <div className="lg:hidden flex items-center justify-between w-full">
              <button
                onClick={toggleDrawer}
                className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-800"
                aria-label="Open navigation menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <div className="flex-1"></div>
            </div>
          </Flex>
        </Container>
      </Section>

      {/* Mobile Drawer - Always rendered for smooth animations */}
      <div className="lg:hidden">
        {/* Backdrop */}
        <div 
          className={cn(
            "fixed inset-0 bg-black transition-opacity duration-300 ease-in-out z-40",
            isDrawerOpen ? "opacity-50 pointer-events-auto" : "opacity-0 pointer-events-none"
          )}
          onClick={toggleDrawer}
        />
        
        {/* Drawer */}
        <div className={cn(
          "fixed left-0 top-0 h-full w-80 bg-white dark:bg-gray-900 shadow-xl z-50 transition-transform duration-300 ease-in-out",
          isDrawerOpen ? "translate-x-0" : "-translate-x-full"
        )}>
          {/* Drawer Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Menu</h2>
            <button
              onClick={toggleDrawer}
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-800"
              aria-label="Close navigation menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Drawer Content - No partitions */}
          <div className="p-4 space-y-4">
            {/* Left Component */}
            {left && (
              <div className="py-2">
                {left}
              </div>
            )}
            
            {/* Right Component */}
            {right && (
              <div className="py-2">
                {right}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
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

export function AppSidebar({ children, className }: PropsWithChildren<{ className?: string }>) {
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


