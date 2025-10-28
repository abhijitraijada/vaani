import { useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store';
import { fetchHostsDashboard } from '../../store/hostSlice';
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
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ className, isOpen = true, onClose }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { activeEvent } = useAppSelector((state) => state.events);

  const handleNavClick = (path: string) => {
    // If clicking on hosts, refresh the hosts data
    if (path === '/hosts' && activeEvent?.id) {
      dispatch(fetchHostsDashboard(activeEvent.id));
    }
    navigate(path);
    // Close sidebar on mobile after navigation
    onClose?.();
  };

  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        'fixed left-0 top-0 h-full w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 z-50 transition-transform duration-300 ease-in-out',
        // Desktop: always visible
        'md:translate-x-0',
        // Mobile: slide in/out
        isOpen ? 'translate-x-0' : '-translate-x-full',
        className
      )}>
        {/* Logo/Brand */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">ES</span>
              </div>
              <Text className="font-bold text-lg text-gray-900 dark:text-gray-100">Event Suit</Text>
            </div>
            
            {/* Close button - only visible on mobile */}
            <button
              onClick={onClose}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Close menu"
            >
              <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
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
    </>
  );
}
