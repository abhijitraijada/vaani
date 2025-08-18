import type { HTMLAttributes, PropsWithChildren } from 'react';
import { cn } from '../../lib/cn';

type Tone = 'default' | 'success' | 'warning' | 'danger' | 'info';

const tones: Record<Tone, string> = {
  default: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
  success: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
  warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300',
  danger: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
  info: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
};

export function Chip({ className, children, tone = 'default', ...props }: PropsWithChildren<HTMLAttributes<HTMLSpanElement>> & { tone?: Tone }) {
  return (
    <span className={cn('inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium', tones[tone], className)} {...props}>
      {children}
    </span>
  );
}


