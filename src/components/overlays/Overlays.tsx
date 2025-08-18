import type { PropsWithChildren } from 'react';
import { cn } from '../../lib/cn';
import { usePresence } from '../utils/usePresence';

export function Modal({ open, onClose, children }: PropsWithChildren<{ open: boolean; onClose: () => void }>) {
  const { mounted, visible } = usePresence(open, 320);
  if (!mounted) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className={cn(
          'absolute inset-0 bg-black/50 transition-opacity duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]',
          visible ? 'opacity-100' : 'opacity-0'
        )}
        onClick={onClose}
      />
      <div
        className={cn(
          'relative z-10 w-full max-w-lg rounded-xl border border-gray-200 bg-white p-6 shadow-xl transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-[transform,opacity] dark:border-gray-800 dark:bg-gray-900',
          visible ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-4 scale-95 opacity-0'
        )}
      >
        {children}
      </div>
    </div>
  );
}

export function Drawer({ open, side = 'right', onClose, children }: PropsWithChildren<{ open: boolean; side?: 'left' | 'right'; onClose: () => void }>) {
  const { mounted, visible } = usePresence(open, 320);
  if (!mounted) return null;
  const sideClass = side === 'left' ? 'left-0' : 'right-0';
  const translate = side === 'left' ? (visible ? 'translate-x-0' : '-translate-x-full') : (visible ? 'translate-x-0' : 'translate-x-full');
  return (
    <div className="fixed inset-0 z-50">
      <div
        className={cn(
          'absolute inset-0 bg-black/50 transition-opacity duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]',
          visible ? 'opacity-100' : 'opacity-0'
        )}
        onClick={onClose}
      />
      <div
        className={cn(
          'absolute top-0 h-full w-96 bg-white p-6 transform-gpu transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform dark:bg-gray-900',
          sideClass,
          translate
        )}
      >
        {children}
      </div>
    </div>
  );
}

export function ConfirmDialog({ open, title, message, onConfirm, onCancel }: { open: boolean; title: string; message: string; onConfirm: () => void; onCancel: () => void }) {
  return (
    <Modal open={open} onClose={onCancel}>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-gray-600">{message}</p>
      <div className="mt-6 flex justify-end gap-3">
        <button className="rounded-md px-4 py-2 text-sm bg-gray-100 text-gray-900 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700" onClick={onCancel}>Cancel</button>
        <button className="rounded-md px-4 py-2 text-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-500" onClick={onConfirm}>Confirm</button>
      </div>
    </Modal>
  );
}

export function Spinner({ size = 20 }: { size?: number }) {
  return <div className="inline-block animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" style={{ width: size, height: size }} />;
}

export function LoadingOverlay({ visible }: { visible: boolean }) {
  const { mounted, visible: vis } = usePresence(visible, 320);
  if (!mounted) return null;
  return (
    <div className={cn('fixed inset-0 z-50 grid place-items-center transition-opacity duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]', vis ? 'bg-white/60 opacity-100 dark:bg-black/60' : 'bg-white/60 opacity-0 dark:bg-black/60')}>
      <Spinner size={32} />
    </div>
  );
}


