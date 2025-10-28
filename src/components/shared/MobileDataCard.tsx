import { ReactNode } from 'react';
import { Card } from '../primitives/Layout';
import { cn } from '../../lib/cn';

interface MobileDataCardProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  isExpanded?: boolean;
}

/**
 * Reusable card component for mobile table-to-card transformations
 * Used to display table rows as cards on mobile devices
 */
export function MobileDataCard({ children, onClick, className, isExpanded }: MobileDataCardProps) {
  return (
    <Card
      className={cn(
        'p-4 cursor-pointer transition-all duration-200 hover:shadow-md',
        isExpanded && 'ring-2 ring-purple-500 bg-purple-50 dark:bg-purple-900/10',
        className
      )}
      onClick={onClick}
    >
      {children}
    </Card>
  );
}

interface MobileCardRowProps {
  label: string;
  value: ReactNode;
  className?: string;
}

/**
 * A row within a MobileDataCard displaying a label and value
 */
export function MobileCardRow({ label, value, className }: MobileCardRowProps) {
  return (
    <div className={cn('flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-800 last:border-0', className)}>
      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{label}</span>
      <span className="text-sm text-gray-900 dark:text-gray-100">{value}</span>
    </div>
  );
}

interface MobileCardSectionProps {
  title?: string;
  children: ReactNode;
  className?: string;
}

/**
 * A section within a MobileDataCard for grouping related information
 */
export function MobileCardSection({ title, children, className }: MobileCardSectionProps) {
  return (
    <div className={cn('space-y-2', className)}>
      {title && (
        <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
          {title}
        </h4>
      )}
      {children}
    </div>
  );
}

