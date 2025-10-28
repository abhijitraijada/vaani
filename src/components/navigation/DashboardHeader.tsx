import { Button } from '../primitives/Button';
import { Text } from '../primitives/Typography';
import { cn } from '../../lib/cn';

interface DashboardHeaderProps {
  pageName: string;
  onMenuClick?: () => void;
  className?: string;
}

export function DashboardHeader({ pageName, onMenuClick, className }: DashboardHeaderProps) {
  const handleLogout = () => {
    // Add logout logic here
    console.log('Logout clicked');
  };

  return (
    <header className={cn(
      'bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 md:px-6 py-4 md:py-5 ml-0 md:ml-64',
      className
    )}>
      <div className="flex items-center justify-between gap-2">
        {/* Left - Hamburger (mobile) + Brand */}
        <div className="flex items-center gap-3">
          {/* Hamburger menu button - only visible on mobile */}
          <button
            onClick={onMenuClick}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Open menu"
          >
            <svg className="w-6 h-6 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <Text className="text-base md:text-lg font-semibold text-gray-900 dark:text-gray-100 whitespace-nowrap">
            Vasindhara ni vaani
          </Text>
        </div>

        {/* Center - Page Name (hidden on small mobile) */}
        <div className="hidden sm:flex flex-1 justify-center">
          <Text className="text-lg md:text-xl font-semibold text-gray-900 dark:text-gray-100">
            {pageName}
          </Text>
        </div>

        {/* Right - Logout */}
        <div className="flex items-center">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleLogout}
            className="md:h-10"
          >
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <Text className="hidden md:inline">Logout</Text>
            </div>
          </Button>
        </div>
      </div>

      {/* Page name for small mobile - below header */}
      <div className="sm:hidden mt-2">
        <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {pageName}
        </Text>
      </div>
    </header>
  );
}
