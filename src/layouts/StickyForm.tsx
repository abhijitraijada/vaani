import type { PropsWithChildren, ReactNode } from 'react';

export function StickyFormLayout({
  footer,
  children,
}: PropsWithChildren<{ footer: ReactNode }>) {
  return (
    <div className="grid min-h-[70vh] grid-rows-[1fr_auto] gap-4">
      <div>{children}</div>
      <div className="sticky bottom-0 -mx-4 flex justify-end gap-3 border-t bg-white/90 px-4 py-3 backdrop-blur dark:border-gray-800 dark:bg-gray-950/90 sm:mx-0 sm:rounded-b-xl">
        {footer}
      </div>
    </div>
  );
}


