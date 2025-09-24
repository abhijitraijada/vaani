import { Button } from '../primitives/Button';
import { Text } from '../primitives/Typography';
import { cn } from '../../lib/cn';

interface DashboardHeaderProps {
  pageName: string;
  className?: string;
}

export function DashboardHeader({ pageName, className }: DashboardHeaderProps) {
  const handleLogout = () => {
    // Add logout logic here
    console.log('Logout clicked');
  };

  return (
    <header className={cn(
      'bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-5 ml-64',
      className
    )}>
      <div className="flex items-center justify-between">
        {/* Left - Brand */}
        <div className="flex items-center">
          <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Vasindhara ni vaani
          </Text>
        </div>

        {/* Center - Page Name */}
        <div className="flex-1 flex justify-center">
          <Text className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            {pageName}
          </Text>
        </div>

        {/* Right - Logout */}
        <div className="flex items-center">
          <Button
            variant="secondary"
            onClick={handleLogout}
          >
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <Text>Logout</Text>
            </div>
          </Button>
        </div>
      </div>
    </header>
  );
}
