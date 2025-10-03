import type { EventDay } from '../../services/endpoints/dashboard.types';
import type { HostDailySchedule } from '../../services/endpoints/host.types';
import { Button } from '../primitives/Button';
import { cn } from '../../lib/cn';

type DayData = EventDay | HostDailySchedule;

interface DateTabsProps {
  days: DayData[];
  selectedDayId: string | null;
  onDaySelect: (dayId: string) => void;
  className?: string;
}

export function DateTabs({ days, selectedDayId, onDaySelect, className }: DateTabsProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className={cn('flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg', className)}>
      {days.map((day) => (
        <Button
          key={day.event_day_id}
          variant={selectedDayId === day.event_day_id ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => onDaySelect(day.event_day_id)}
          className={cn(
            'flex-1 text-sm font-medium transition-colors',
            selectedDayId === day.event_day_id
              ? 'bg-white dark:bg-gray-700 shadow-sm'
              : 'hover:bg-gray-200 dark:hover:bg-gray-700'
          )}
        >
          <div className="text-center">
            <div className="font-semibold">{formatDate(day.event_date)}</div>
            <div className="text-xs opacity-75">{day.location_name}</div>
          </div>
        </Button>
      ))}
    </div>
  );
}
