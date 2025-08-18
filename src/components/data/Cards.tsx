import { cn } from '../../lib/cn';

export function StatCard({ label, value, className }: { label: string; value: string | number; className?: string }) {
  return (
    <div className={cn('rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900', className)}>
      <div className="text-sm text-gray-500">{label}</div>
      <div className="mt-1 text-2xl font-semibold text-gray-900 dark:text-gray-100">{value}</div>
    </div>
  );
}

export function CapacityBar({ used, total }: { used: number; total: number }) {
  const pct = Math.min(100, Math.max(0, (used / total) * 100));
  return (
    <div className="h-2 w-full overflow-hidden rounded bg-gray-200 dark:bg-gray-800">
      <div className="h-full bg-blue-600" style={{ width: `${pct}%` }} />
    </div>
  );
}


