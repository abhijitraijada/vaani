import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '../../lib/cn';
import { Text } from '../primitives/Typography';

interface NavItem {
  id: string;
  label: string;
  icon: string;
  path: string;
}

const navigationItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: '🏠', path: '/dashboard' },
  { id: 'participants', label: 'Participants', icon: '👥', path: '/participants' },
  { id: 'hosts', label: 'Hosts', icon: '🏡', path: '/hosts' },
];

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavClick = (path: string) => {
    navigate(path);
  };

  return (
    <div className={cn(
      'fixed left-0 top-0 h-full w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 z-10',
      className
    )}>
      {/* Logo/Brand */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">ES</span>
          </div>
          <Text className="font-bold text-lg text-gray-900 dark:text-gray-100">Event Suit</Text>
        </div>
      </div>

      {/* Navigation - Top Aligned */}
      <nav className="p-4">
        <div className="space-y-2">
          {navigationItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.path)}
                className={cn(
                  'w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors duration-200',
                  isActive
                    ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300'
                    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                )}
              >
                <span className="text-lg">{item.icon}</span>
                <Text className="font-medium">{item.label}</Text>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
