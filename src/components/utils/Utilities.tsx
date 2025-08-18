import type { PropsWithChildren } from 'react';
import { useState } from 'react';
import { cn } from '../../lib/cn';

export function CopyToClipboard({
  text,
  className,
  buttonLabel = 'Copy',
  successLabel = 'Copied!',
}: {
  text: string;
  className?: string;
  buttonLabel?: string;
  successLabel?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // no-op; clipboard may be unavailable
    }
  }

  return (
    <div
      className={cn(
        'grid grid-cols-[1fr_auto] items-center gap-3 rounded-md border border-gray-200 bg-gray-50 px-3 py-2 dark:border-gray-800 dark:bg-gray-900',
        className,
      )}
    >
      <code className="font-mono text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap break-words">{text}</code>
      <button
        type="button"
        onClick={handleCopy}
        className={
          'inline-flex items-center rounded-md bg-gray-100 px-3 py-1.5 text-sm text-gray-900 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700'
        }
      >
        {copied ? successLabel : buttonLabel}
      </button>
    </div>
  );
}

export function ErrorBoundary({ children }: PropsWithChildren) {
  return <>{children}</>;
}

export function ProtectedRoute({ allowed, children }: PropsWithChildren<{ allowed: boolean }>) {
  if (!allowed) return null;
  return <>{children}</>;
}


