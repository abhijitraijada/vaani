import { Card } from '../primitives/Layout';
import { Heading, Text } from '../primitives/Typography';

interface SummaryCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon?: React.ReactNode;
  className?: string;
}

export function SummaryCard({ title, value, subtitle, icon, className }: SummaryCardProps) {
  return (
    <Card className={`p-4 md:p-6 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <Text className="text-xs md:text-sm font-medium text-gray-600 dark:text-gray-400 mb-1 truncate">
            {title}
          </Text>
          <Heading className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100">
            {value}
          </Heading>
          {subtitle && (
            <Text className="text-xs text-gray-500 dark:text-gray-500 mt-1 truncate">
              {subtitle}
            </Text>
          )}
        </div>
        {icon && (
          <div className="text-gray-400 dark:text-gray-500 text-2xl md:text-3xl ml-2 flex-shrink-0">
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
}

