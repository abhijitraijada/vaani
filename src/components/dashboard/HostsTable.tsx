import { useState, useMemo, useEffect } from 'react';
import type { HostWithAssignments } from '../../services/endpoints/host.types';
import { Card } from '../primitives/Layout';
import { Heading } from '../primitives/Typography';
import { Button } from '../primitives/Button';
import { Icon } from '../primitives/Icon';
import { Tooltip } from '../primitives/Tooltip';
import { ExportButton } from '../export';
import { HostParticipantsModal } from './HostParticipantsModal';
import { MobileDataCard, MobileCardSection } from '../shared/MobileDataCard';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { cn } from '../../lib/cn';
import type { ExportOptions } from '../../services/export/export.types';

interface HostsTableProps {
  hosts: HostWithAssignments[];
  onPageChange: (page: number) => void;
  onExport?: (options: ExportOptions) => Promise<void>;
  onAddHost?: () => void;
  onEditHost?: (host: HostWithAssignments) => void;
  onDeleteHost?: (hostId: string) => void;
  onAddParticipants?: (host: HostWithAssignments) => void;
  onHostDataRefresh?: () => void;
  availableDays?: Array<{
    id: string;
    date: string;
    location: string;
    hosts: HostWithAssignments[];
    participants: Array<{
      status: 'registered' | 'waiting' | 'confirmed' | 'cancelled';
    }>;
  }>;
  className?: string;
}

export function HostsTable({ 
  hosts, 
  onPageChange, 
  onExport,
  onAddHost,
  onEditHost,
  onDeleteHost,
  onAddParticipants,
  onHostDataRefresh,
  availableDays,
  className 
}: HostsTableProps) {
  const { isMobile } = useMediaQuery();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: 'max_participants' | null; direction: 'asc' | 'desc' }>({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 50;
  
  // Modal state
  const [selectedHost, setSelectedHost] = useState<HostWithAssignments | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Mobile sort dropdown state
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  const handleSort = (key: 'max_participants') => {
    setSortConfig(prevConfig => {
      // If clicking the same key, cycle through: asc -> desc -> no sort
      if (prevConfig.key === key) {
        if (prevConfig.direction === 'asc') {
          return { key, direction: 'desc' };
        } else if (prevConfig.direction === 'desc') {
          return { key: null, direction: 'asc' }; // Remove sort on third click
        }
      }
      // If clicking a different key or no current sort, start with asc
      return { key, direction: 'asc' };
    });
  };

  const filteredHosts = useMemo(() => {
    let filtered = hosts;
    
    if (searchTerm) {
      filtered = hosts.filter(host =>
        host.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        host.phone_no.toString().includes(searchTerm) ||
        host.place_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        host.facilities_description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (sortConfig.key) {
      filtered = [...filtered].sort((a, b) => {
        if (sortConfig.key === 'max_participants') {
          return sortConfig.direction === 'asc' 
            ? a.max_participants - b.max_participants 
            : b.max_participants - a.max_participants;
        }
        return 0;
      });
    }

    return filtered;
  }, [hosts, searchTerm, sortConfig]);

  // Paginate the filtered results
  const totalPages = Math.ceil(filteredHosts.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedHosts = filteredHosts.slice(startIndex, endIndex);

  // Reset to page 1 when search term changes
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handlePageChangeInternal = (page: number) => {
    setCurrentPage(page);
    onPageChange(page);
  };

  const handleRowClick = (host: HostWithAssignments) => {
    setSelectedHost(host);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedHost(null);
  };

  const handleAssignmentDeleted = () => {
    // Trigger host data refresh in parent component
    onHostDataRefresh?.();
  };

  // Reset to page 1 when hosts data changes (e.g., switching days)
  useEffect(() => {
    setCurrentPage(1);
  }, [hosts]);

  const getCapacityColor = (currentCapacity: number, maxCapacity: number) => {
    const utilization = currentCapacity / maxCapacity;
    if (utilization >= 1) return 'text-red-600 dark:text-red-400';
    if (utilization >= 0.8) return 'text-orange-600 dark:text-orange-400';
    return 'text-green-600 dark:text-green-400';
  };

  const getGenderPreferenceColor = (preference: string) => {
    switch (preference) {
      case 'male': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200';
      case 'female': return 'bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-200';
      default: return 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  const getToiletFacilitiesColor = (facilities: string) => {
    switch (facilities) {
      case 'indian': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200';
      case 'western': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-200';
      case 'both': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200';
      default: return 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  return (
    <Card className={cn('p-6', className)}>
      {/* Sticky Header Section */}
      <div className="sticky top-0 z-20 bg-white dark:bg-gray-900 pb-4 mb-6 border-b border-gray-200 dark:border-gray-700">
        <Heading className="text-xl font-semibold mb-4">Hosts</Heading>
        
        {/* Search and Controls */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search hosts..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          
          {/* Action Buttons */}
          <div className="flex-shrink-0 flex gap-2">
            {/* Mobile Sort Button */}
            {isMobile && (
              <div className="relative">
                <Button
                  variant="secondary"
                  onClick={() => setShowSortDropdown(!showSortDropdown)}
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                  </svg>
                  <span className="hidden sm:inline">Sort</span>
                </Button>
                
                {/* Sort Dropdown */}
                {showSortDropdown && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setShowSortDropdown(false)}
                    />
                    <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                      <div className="p-2">
                        <div className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                          Sort By
                        </div>
                        <button
                          onClick={() => {
                            handleSort('max_participants');
                            setShowSortDropdown(false);
                          }}
                          className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-sm flex items-center gap-2"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          Capacity
                          {sortConfig.key === 'max_participants' && (
                            <span className="ml-auto text-xs">
                              {sortConfig.direction === 'asc' ? '↑' : '↓'}
                            </span>
                          )}
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
            
            <Button
              variant="primary"
              onClick={onAddHost}
            >
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span className="hidden sm:inline">Add</span>
                <span className="hidden md:inline">Host</span>
              </div>
            </Button>
            
            {/* Export Button */}
            {onExport && availableDays && (
              <ExportButton
                onExport={onExport}
                availableDays={availableDays}
              />
            )}
          </div>
        </div>
      </div>

      {/* Mobile Sort Indicator */}
      {isMobile && sortConfig.key && (
        <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-sm mb-4">
          <span className="text-purple-700 dark:text-purple-300 font-medium">
            Sorted by: Capacity ({sortConfig.direction === 'asc' ? 'Low to High' : 'High to Low'})
          </span>
          <button
            onClick={() => setSortConfig({ key: null, direction: 'asc' })}
            className="text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-200"
          >
            Clear
          </button>
        </div>
      )}

      {/* Mobile Card View */}
      {isMobile && (
        <div className="space-y-3 md:hidden">
          {paginatedHosts.map((host, index) => (
            <MobileDataCard
              key={host.id}
              onClick={() => handleRowClick(host)}
            >
              <div className="space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-base">
                      {host.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {host.place_name}
                    </p>
                  </div>
                  <div className="text-right text-sm font-medium text-gray-500 dark:text-gray-400">
                    #{index + 1}
                  </div>
                </div>

                {/* Contact */}
                <MobileCardSection>
                  <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    {host.phone_no}
                  </div>
                </MobileCardSection>

                {/* Capacity */}
                <MobileCardSection title="Capacity">
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div>
                      <div className="text-gray-600 dark:text-gray-400 text-xs">Max</div>
                      <div className="font-semibold text-gray-900 dark:text-gray-100">
                        {host.max_participants}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-600 dark:text-gray-400 text-xs">Assigned</div>
                      <div className={`font-semibold ${getCapacityColor(host.current_capacity, host.max_participants)}`}>
                        {host.current_capacity}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-600 dark:text-gray-400 text-xs">Available</div>
                      <div className="font-semibold text-green-600 dark:text-green-400">
                        {host.available_capacity}
                      </div>
                    </div>
                  </div>
                </MobileCardSection>

                {/* Preferences */}
                <MobileCardSection title="Preferences">
                  <div className="flex gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getGenderPreferenceColor(host.gender_preference)}`}>
                      {host.gender_preference}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getToiletFacilitiesColor(host.toilet_facilities)}`}>
                      {host.toilet_facilities}
                    </span>
                  </div>
                </MobileCardSection>

                {/* Facilities Description */}
                {host.facilities_description && (
                  <MobileCardSection title="Facilities">
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {host.facilities_description}
                    </p>
                  </MobileCardSection>
                )}

                {/* Actions */}
                <div className="flex gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditHost?.(host);
                    }}
                    className="flex-1"
                  >
                    <Icon name="pencil" width={16} height={16} className="mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddParticipants?.(host);
                    }}
                    className="flex-1"
                  >
                    <Icon name="user-plus" width={16} height={16} className="mr-1" />
                    Add
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteHost?.(host.id);
                    }}
                    className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                  >
                    <Icon name="trash" width={16} height={16} />
                  </Button>
                </div>
              </div>
            </MobileDataCard>
          ))}
        </div>
      )}

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto relative">
        <table className="w-full">
          <thead className="sticky top-0 z-10 bg-white dark:bg-gray-900 shadow-sm">
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100">#</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100">Host Details</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100">Contact</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100">Location</th>
              <th 
                className="text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 select-none"
                onClick={() => handleSort('max_participants')}
              >
                <div className="flex items-center gap-1">
                  Capacity
                  {sortConfig.key === 'max_participants' && (
                    <span className="text-xs">
                      {sortConfig.direction === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100">Preferences</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100">Facilities</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedHosts.map((host, index) => (
              <tr 
                key={host.id} 
                className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors duration-200"
                onClick={() => handleRowClick(host)}
              >
                <td className="py-4 px-4 text-left">
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {index + 1}
                  </div>
                </td>
                <td className="py-4 px-4 text-left">
                  <div>
                    <div className="font-medium text-gray-900 dark:text-gray-100">
                      {host.name}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Host ID: {host.id.substring(0, 8)}...
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4 text-left">
                  <div className="text-sm">
                    <div className="text-gray-900 dark:text-gray-100">{host.phone_no}</div>
                  </div>
                </td>
                <td className="py-4 px-4 text-left">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {host.place_name}
                  </div>
                </td>
                <td className="py-4 px-4 text-left">
                  <div className="text-sm">
                    <div className="text-gray-900 dark:text-gray-100">
                      Max: {host.max_participants}
                    </div>
                    <div className={`text-sm ${getCapacityColor(host.current_capacity, host.max_participants)}`}>
                      Assigned: {host.current_capacity}
                    </div>
                    <div className="text-sm text-green-600 dark:text-green-400">
                      Available: {host.available_capacity}
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4 text-left">
                  <div className="flex flex-col gap-1">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getGenderPreferenceColor(host.gender_preference)}`}>
                      {host.gender_preference}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getToiletFacilitiesColor(host.toilet_facilities)}`}>
                      {host.toilet_facilities}
                    </span>
                  </div>
                </td>
                <td className="py-4 px-4 text-left">
                  <div className="text-sm text-gray-600 dark:text-gray-400 max-w-xs">
                    <div className="truncate">
                      {host.facilities_description || 'No description'}
                    </div>
                    {host.assigned_participants.length > 0 && (
                      <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                        {host.assigned_participants.length} participant{host.assigned_participants.length !== 1 ? 's' : ''} assigned
                      </div>
                    )}
                  </div>
                </td>
                <td className="py-4 px-4 text-left">
                  <div className="flex gap-1">
                    <Tooltip label="Delete Host">
                      <Button
                        variant="icon"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteHost?.(host.id);
                        }}
                        className="w-8 h-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20"
                      >
                        <Icon name="trash" width={16} height={16} />
                      </Button>
                    </Tooltip>
                    
                    <Tooltip label="Edit Host">
                      <Button
                        variant="icon"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditHost?.(host);
                        }}
                        className="w-8 h-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:text-blue-300 dark:hover:bg-blue-900/20"
                      >
                        <Icon name="pencil" width={16} height={16} />
                      </Button>
                    </Tooltip>
                    
                    <Tooltip label="Add Participants">
                      <Button
                        variant="icon"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onAddParticipants?.(host);
                        }}
                        className="w-8 h-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50 dark:text-green-400 dark:hover:text-green-300 dark:hover:bg-green-900/20"
                      >
                        <Icon name="user-plus" width={16} height={16} />
                      </Button>
                    </Tooltip>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="text-sm text-gray-700 dark:text-gray-300">
          Showing {startIndex + 1} to{' '}
          {Math.min(endIndex, filteredHosts.length)} of{' '}
          {filteredHosts.length} hosts
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handlePageChangeInternal(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          
          <div className="flex gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const page = i + 1;
              return (
                <Button
                  key={page}
                  variant={currentPage === page ? 'primary' : 'secondary'}
                  size="sm"
                  onClick={() => handlePageChangeInternal(page)}
                  className="w-8 h-8 p-0"
                >
                  {page}
                </Button>
              );
            })}
          </div>
          
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handlePageChangeInternal(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </div>

      {/* Host Participants Modal */}
      <HostParticipantsModal
        host={selectedHost}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onAssignmentDeleted={handleAssignmentDeleted}
      />
    </Card>
  );
}
