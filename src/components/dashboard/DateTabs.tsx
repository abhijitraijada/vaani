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
    <div className={cn('relative', className)}>
      {/* Horizontal scrollable container with snap scroll */}
      <div className={cn(
        'flex gap-2 overflow-x-auto scrollbar-hide snap-x snap-mandatory scroll-smooth',
        'bg-gray-100 dark:bg-gray-800 p-2 rounded-lg',
        // Hide scrollbar on all browsers
        '[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]'
      )}>
        {days.map((day) => (
          <Button
            key={day.event_day_id}
            variant={selectedDayId === day.event_day_id ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => onDaySelect(day.event_day_id)}
            className={cn(
              'flex-shrink-0 snap-start text-sm font-medium transition-colors',
              // Desktop: flex-1 for equal width, Mobile: min-width for scrolling
              'md:flex-1 min-w-[140px]',
              selectedDayId === day.event_day_id
                ? 'bg-white dark:bg-gray-700 shadow-sm'
                : 'hover:bg-gray-200 dark:hover:bg-gray-700'
            )}
          >
            <div className="text-center px-2">
              <div className="font-semibold whitespace-nowrap">{formatDate(day.event_date)}</div>
              <div className="text-xs opacity-75 truncate max-w-[120px]">{day.location_name}</div>
            </div>
          </Button>
        ))}
      </div>
      
      {/* Scroll indicators for mobile - show when there are more items */}
      {days.length > 2 && (
        <>
          <div className="md:hidden absolute left-0 top-1/2 -translate-y-1/2 bg-gradient-to-r from-gray-100 dark:from-gray-800 to-transparent w-8 h-full pointer-events-none rounded-l-lg" />
          <div className="md:hidden absolute right-0 top-1/2 -translate-y-1/2 bg-gradient-to-l from-gray-100 dark:from-gray-800 to-transparent w-8 h-full pointer-events-none rounded-r-lg" />
        </>
      )}
    </div>
  );
}
