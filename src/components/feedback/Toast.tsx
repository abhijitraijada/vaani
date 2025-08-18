import React, { createContext, useCallback, useContext, useMemo, useRef, useState, type PropsWithChildren } from 'react';
import { cn } from '../../lib/cn';
import { Icon } from '../primitives/Icon';
import { Spinner } from '../overlays/Overlays';
import { usePresence } from '../utils/usePresence';

export type ToastVariant = 'success' | 'error' | 'warning' | 'info' | 'loading';
export type ToastPosition =
  | 'top-right'
  | 'top-center'
  | 'top-left'
  | 'bottom-right'
  | 'bottom-center'
  | 'bottom-left';

export type ToastOptions = {
  title?: string;
  description?: string;
  variant?: ToastVariant;
  durationMs?: number; // default 4000, loading default 0 (manual)
};

type ToastRecord = {
  id: string;
  title: string;
  description: string;
  variant: ToastVariant;
  durationMs: number;
};

type ToastContextValue = {
  show: (opts: ToastOptions) => string;
  dismiss: (id: string) => void;
  clear: () => void;
  update: (id: string, opts: Partial<Omit<ToastRecord, 'id'>>) => void;
  success: (opts: Omit<ToastOptions, 'variant'>) => string;
  error: (opts: Omit<ToastOptions, 'variant'>) => string;
  warning: (opts: Omit<ToastOptions, 'variant'>) => string;
  info: (opts: Omit<ToastOptions, 'variant'>) => string;
  loading: (opts?: Omit<ToastOptions, 'variant'>) => string;
  position: ToastPosition;
  setPosition: (pos: ToastPosition) => void;
};

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children, position: initialPosition = 'top-right' }: PropsWithChildren<{ position?: ToastPosition }>) {
  const [toasts, setToasts] = useState<ToastRecord[]>([]);
  const [position, setPosition] = useState<ToastPosition>(initialPosition);
  const idSeq = useRef(0);

  const dismiss = useCallback((id: string) => {
    setToasts((curr) => curr.filter((t) => t.id !== id));
  }, []);

  const show = useCallback((opts: ToastOptions) => {
    const id = String(++idSeq.current);
    const variant = opts.variant ?? 'info';
    const durationMs = opts.durationMs ?? (variant === 'loading' ? 0 : 4000);
    const rec: ToastRecord = {
      id,
      title: opts.title ?? '',
      description: opts.description ?? '',
      variant,
      durationMs,
    };
    setToasts((curr) => [rec, ...curr]);
    return id;
  }, []);

  const clear = useCallback(() => setToasts([]), []);

  const update = useCallback((id: string, opts: Partial<Omit<ToastRecord, 'id'>>) => {
    setToasts((curr) => curr.map((t) => {
      if (t.id !== id) return t;
      const nextVariant = opts.variant ?? t.variant;
      // If converting from loading (0 duration) to non-loading and no duration provided, default to 4000
      const nextDuration = opts.durationMs !== undefined
        ? opts.durationMs
        : (t.variant === 'loading' && nextVariant !== 'loading' ? 4000 : t.durationMs);
      return {
        ...t,
        ...opts,
        variant: nextVariant,
        durationMs: nextDuration,
      };
    }));
  }, []);

  const api = useMemo<ToastContextValue>(() => ({
    show,
    dismiss,
    clear,
    update,
    success: (opts) => show({ ...opts, variant: 'success' }),
    error: (opts) => show({ ...opts, variant: 'error' }),
    warning: (opts) => show({ ...opts, variant: 'warning' }),
    info: (opts) => show({ ...opts, variant: 'info' }),
    loading: (opts) => show({ ...(opts ?? {}), variant: 'loading' }),
    position,
    setPosition,
  }), [show, dismiss, clear, update, position]);

  return (
    <ToastContext.Provider value={api}>
      {children}
      <ToastViewport toasts={toasts} onDismiss={dismiss} position={position} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

function variantClasses(variant: ToastVariant): string {
  switch (variant) {
    case 'success':
      return 'border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-900 dark:text-green-100';
    case 'error':
      return 'border-red-200 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-900 dark:text-red-100';
    case 'warning':
      return 'border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-900 dark:text-amber-100';
    case 'info':
      return 'border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-800 dark:bg-blue-900 dark:text-blue-100';
    case 'loading':
      return 'border-gray-200 bg-white text-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100';
  }
  return '';
}

function positionClasses(position: ToastPosition) {
  const common = 'pointer-events-none fixed z-50 flex w-full max-w-sm px-4 sm:px-6 transition-opacity duration-200';
  const items = position.includes('left') ? 'items-start' : position.includes('right') ? 'items-end' : 'items-center';
  const atTop = position.startsWith('top');
  const axis = atTop ? 'top-4' : 'bottom-4';
  const x = position.endsWith('left') ? 'left-0' : position.endsWith('right') ? 'right-0' : 'left-1/2 -translate-x-1/2';
  const direction = atTop ? 'flex-col' : 'flex-col-reverse';
  return `${common} ${axis} ${x} ${direction} ${items}`;
}

function ProgressCircle({ durationMs, onComplete, paused }: { durationMs: number; onComplete: () => void; paused?: boolean }) {
  const [progress, setProgress] = useState(0); // 0..1
  const startRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  React.useEffect(() => {
    if (durationMs <= 0) return; // manual
    const tick: FrameRequestCallback = (ts) => {
      if (startRef.current === null) startRef.current = ts;
      if (paused) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }
      const elapsed = ts - startRef.current;
      const nextProgress = Math.min(1, elapsed / durationMs);
      setProgress(nextProgress);
      if (nextProgress >= 1) {
        onComplete();
      } else {
        rafRef.current = requestAnimationFrame(tick);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [durationMs, onComplete, paused]);

  const size = 20;
  const stroke = 2;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashoffset = circumference * (1 - progress);

  if (durationMs <= 0) {
    return null;
  }

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="shrink-0">
      <circle cx={size / 2} cy={size / 2} r={radius} stroke="currentColor" strokeOpacity="0.2" strokeWidth={stroke} fill="none" />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="currentColor"
        strokeWidth={stroke}
        fill="none"
        strokeDasharray={circumference}
        strokeDashoffset={dashoffset}
        strokeLinecap="round"
      />
    </svg>
  );
}

function ToastItem({ toast, onDismiss }: { toast: ToastRecord; onDismiss: (id: string) => void }) {
  const [hovered, setHovered] = useState(false);
  const [open, setOpen] = useState(true);
  const { mounted, visible } = usePresence(open, 220);
  const { id, title, description, variant, durationMs } = toast;

  const close = useCallback(() => {
    setOpen(false);
    window.setTimeout(() => onDismiss(id), 220);
  }, [id, onDismiss]);

  if (!mounted) return null;

  return (
    <div
      className={cn(
        'pointer-events-auto mt-2 w-full overflow-hidden rounded-lg border p-3 shadow-md backdrop-blur-sm transition-all duration-200 sm:p-4',
        variantClasses(variant),
        visible ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
      )}
      role="status"
      aria-live="polite"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="flex items-center gap-3">
        <div className="flex h-5 w-5 items-center justify-center">
          {durationMs && durationMs > 0 ? (
            <ProgressCircle durationMs={durationMs} onComplete={close} paused={hovered} />
          ) : variant === 'loading' ? (
            <Spinner size={16} />
          ) : null}
        </div>
        <div className="min-w-0 grow">
          {title ? <div className="truncate text-sm font-semibold">{title}</div> : null}
          {description ? <div className="mt-0.5 truncate text-sm opacity-80">{description}</div> : null}
        </div>
        <div className="ml-2 flex items-center gap-2">
          <button
            aria-label="Close"
            className="rounded-md p-2 text-current/90 hover:bg-black/10 hover:text-current active:scale-95 dark:hover:bg-white/10"
            onClick={close}
          >
            <Icon name="x" width={18} height={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

function ToastViewport({ toasts, onDismiss, position }: { toasts: ToastRecord[]; onDismiss: (id: string) => void; position: ToastPosition }) {
  return (
    <div className={positionClasses(position)}>
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onDismiss={onDismiss} />
      ))}
    </div>
  );
}


