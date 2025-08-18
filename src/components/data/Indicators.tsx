export type BadgeTone = 'gray' | 'blue' | 'green' | 'yellow' | 'red' | 'purple';

export function Pill({ tone = 'gray', children }: { tone?: BadgeTone; children: React.ReactNode }) {
  const toneMap: Record<BadgeTone, string> = {
    gray: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
    blue: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
    green: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
    yellow: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300',
    red: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
    purple: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
  };
  return <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${toneMap[tone]}`}>{children}</span>;
}

// Domain helpers can be added later in the domain phase


