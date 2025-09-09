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
    <Card className={`p-6 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <Text className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
            {title}
          </Text>
          <Heading className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {value}
          </Heading>
          {subtitle && (
            <Text className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              {subtitle}
            </Text>
          )}
        </div>
        {icon && (
          <div className="text-gray-400 dark:text-gray-500">
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
}

