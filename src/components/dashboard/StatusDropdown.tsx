import { useState, useRef, useEffect } from 'react';
import { Chip } from '../primitives/Badge';
import { cn } from '../../lib/cn';
import type { MemberStatus } from '../../services/endpoints/registration.types';

interface StatusDropdownProps {
  currentStatus: MemberStatus;
  onStatusChange: (status: MemberStatus) => void;
  isLoading?: boolean;
  className?: string;
}

const statusOptions: Array<{
  value: MemberStatus;
  label: string;
  tone: 'success' | 'warning' | 'info' | 'danger' | 'default';
}> = [
  { value: 'confirmed', label: 'Confirmed', tone: 'success' },
  { value: 'registered', label: 'Registered', tone: 'info' },
  { value: 'waiting', label: 'Waiting', tone: 'warning' },
  { value: 'cancelled', label: 'Cancelled', tone: 'danger' },
];

export function StatusDropdown({ 
  currentStatus, 
  onStatusChange, 
  isLoading = false,
  className 
}: StatusDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleStatusSelect = (status: MemberStatus) => {
    onStatusChange(status);
    setIsOpen(false);
  };

  const currentOption = statusOptions.find(option => option.value === currentStatus);

  return (
    <div 
      className={cn('relative', className)} 
      ref={dropdownRef}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Current Status Badge - Clickable */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          if (!isLoading) {
            setIsOpen(!isOpen);
          }
        }}
        disabled={isLoading}
        className={cn(
          'inline-flex items-center gap-1 transition-all duration-200',
          isLoading 
            ? 'opacity-50 cursor-not-allowed' 
            : 'hover:opacity-80 cursor-pointer'
        )}
      >
        <Chip tone={currentOption?.tone || 'default'}>
          {currentOption?.label || currentStatus}
        </Chip>
        {!isLoading && (
          <svg
            className={cn(
              'w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform duration-200',
              isOpen && 'rotate-180'
            )}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
          <div className="py-1">
            {statusOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleStatusSelect(option.value);
                }}
                className={cn(
                  'w-full px-3 py-2 text-left text-sm transition-colors duration-200',
                  'hover:bg-gray-50 dark:hover:bg-gray-700',
                  'first:rounded-t-lg last:rounded-b-lg',
                  option.value === currentStatus && 'bg-gray-100 dark:bg-gray-700'
                )}
              >
                <div className="flex items-center gap-2">
                  <Chip tone={option.tone} className="text-xs">
                    {option.label}
                  </Chip>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
