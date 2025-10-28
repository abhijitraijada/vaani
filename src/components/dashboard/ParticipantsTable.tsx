import { useState, useMemo, useEffect } from 'react';
import type { Participant } from '../../services/endpoints/dashboard.types';
import { Card } from '../primitives/Layout';
import { Heading, Text } from '../primitives/Typography';
import { Button } from '../primitives/Button';
import { ExportButton } from '../export';
import { StatusDropdown } from './StatusDropdown';
import { ParticipantDetailsModal } from './ParticipantDetailsModal';
import { MobileDataCard, MobileCardSection } from '../shared/MobileDataCard';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { cn } from '../../lib/cn';
import type { ExportOptions } from '../../services/export/export.types';
import type { MemberStatus } from '../../services/endpoints/registration.types';

interface ParticipantsTableProps {
  participants: Participant[];
  onPageChange: (page: number) => void;
  onExport?: (options: ExportOptions) => Promise<void>;
  onAddParticipant?: () => void;
  onStatusUpdate?: (participantId: string, status: MemberStatus) => Promise<void>;
  onAssignmentDeleted?: () => void;
  eventDayId?: string;
  availableDays?: Array<{
    id: string;
    date: string;
    location: string;
    participants: Array<{
      status: 'registered' | 'waiting' | 'confirmed' | 'cancelled';
    }>;
  }>;
  className?: string;
}

export function ParticipantsTable({ 
  participants, 
  onPageChange, 
  onExport,
  onAddParticipant,
  onStatusUpdate,
  onAssignmentDeleted,
  eventDayId,
  availableDays,
  className 
}: ParticipantsTableProps) {
  const { isMobile } = useMediaQuery();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: 'age' | 'status' | null; direction: 'asc' | 'desc' }>({ key: null, direction: 'asc' });
  const [statusSortPriority, setStatusSortPriority] = useState<MemberStatus | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const pageSize = 50;

  // Modal state
  const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Mobile sort dropdown state
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  // Define status order for sorting (ascending order)
  const statusOrder: Record<MemberStatus, number> = {
    'registered': 1,
    'waiting': 2,
    'confirmed': 3,
    'cancelled': 4,
  };

  // Define status colors for visual indicators
  const statusColors: Record<MemberStatus, string> = {
    'registered': 'bg-blue-500',
    'waiting': 'bg-yellow-500',
    'confirmed': 'bg-green-500',
    'cancelled': 'bg-red-500',
  };

  const handleSort = (key: 'age' | 'status') => {
    if (key === 'age') {
      // Age sorting remains the same: asc -> desc -> no sort
      setSortConfig(prevConfig => {
        if (prevConfig.key === 'age') {
          if (prevConfig.direction === 'asc') {
            return { key: 'age', direction: 'desc' };
          } else if (prevConfig.direction === 'desc') {
            return { key: null, direction: 'asc' }; // Remove sort on third click
          }
        }
        return { key: 'age', direction: 'asc' };
      });
      setStatusSortPriority(null); // Clear status priority when sorting by age
    } else if (key === 'status') {
      // Custom status sorting: Confirmed -> Registered -> Waiting -> Cancelled -> No sort
      const statusPriorityOrder: MemberStatus[] = ['confirmed', 'registered', 'waiting', 'cancelled'];
      
      setStatusSortPriority(prevPriority => {
        if (prevPriority === null) {
          // First click: Confirmed
          setSortConfig({ key: 'status', direction: 'asc' });
          return 'confirmed';
        } else {
          const currentIndex = statusPriorityOrder.indexOf(prevPriority);
          const nextIndex = (currentIndex + 1) % statusPriorityOrder.length;
          
          if (nextIndex === 0) {
            // Fifth click: Remove sort
            setSortConfig({ key: null, direction: 'asc' });
            return null;
          } else {
            // Next priority status
            setSortConfig({ key: 'status', direction: 'asc' });
            return statusPriorityOrder[nextIndex];
          }
        }
      });
    }
  };

  const handleStatusUpdate = async (participantId: string, status: MemberStatus) => {
    if (!onStatusUpdate) return;
    
    setUpdatingStatus(participantId);
    try {
      await onStatusUpdate(participantId, status);
    } catch (error) {
      console.error('Failed to update participant status:', error);
      // You could add toast notification here
    } finally {
      setUpdatingStatus(null);
    }
  };

  const handleRowClick = (participant: Participant) => {
    try {
      setSelectedParticipant(participant);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error opening modal:', error);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedParticipant(null);
  };

  const handleAssignmentDeleted = () => {
    // Trigger data refresh in parent component
    onAssignmentDeleted?.();
  };

  const filteredParticipants = useMemo(() => {
    let filtered = participants;
    
    if (searchTerm) {
      filtered = participants.filter(participant =>
        participant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        participant.phone_number.includes(searchTerm) ||
        participant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        participant.city.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (sortConfig.key) {
      filtered = [...filtered].sort((a, b) => {
        if (sortConfig.key === 'age') {
          return sortConfig.direction === 'asc' 
            ? a.age - b.age 
            : b.age - a.age;
        } else if (sortConfig.key === 'status' && statusSortPriority) {
          // Custom priority-based sorting
          if (a.status === statusSortPriority && b.status !== statusSortPriority) {
            return -1; // Priority status comes first
          } else if (a.status !== statusSortPriority && b.status === statusSortPriority) {
            return 1; // Priority status comes first
          } else {
            // If both have same priority status or both don't have it, sort by status order
            const aOrder = statusOrder[a.status];
            const bOrder = statusOrder[b.status];
            return aOrder - bOrder;
          }
        }
        return 0;
      });
    }

    return filtered;
  }, [participants, searchTerm, sortConfig, statusSortPriority]);

  // Paginate the filtered results
  const totalPages = Math.ceil(filteredParticipants.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedParticipants = filteredParticipants.slice(startIndex, endIndex);

  // Reset to page 1 when search term changes
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handlePageChangeInternal = (page: number) => {
    setCurrentPage(page);
    onPageChange(page);
  };

  // Reset to page 1 when participants data changes (e.g., switching days)
  useEffect(() => {
    setCurrentPage(1);
  }, [participants]);


  return (
    <Card className={cn('p-6', className)}>
      {/* Sticky Header Section */}
      <div className="sticky top-0 z-20 bg-white dark:bg-gray-900 pb-4 mb-6 border-b border-gray-200 dark:border-gray-700">
        <Heading className="text-xl font-semibold mb-4">Participants</Heading>
        
        {/* Search and Controls */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search participants..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                            handleSort('age');
                            setShowSortDropdown(false);
                          }}
                          className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-sm"
                        >
                          Age
                        </button>
                        
                        <div className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mt-2">
                          Sort by Status
                        </div>
                        {Object.keys(statusOrder).map((status) => (
                          <button
                            key={status}
                            onClick={() => {
                              handleStatusSort(status as MemberStatus);
                              setShowSortDropdown(false);
                            }}
                            className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-sm capitalize flex items-center gap-2"
                          >
                            <div className={cn(
                              'w-2 h-2 rounded-full',
                              status === 'registered' && 'bg-green-500',
                              status === 'waiting' && 'bg-yellow-500',
                              status === 'not_attending' && 'bg-red-500',
                              status === 'cancelled' && 'bg-gray-500',
                              status === 'assigned' && 'bg-blue-500',
                              status === 'unassigned' && 'bg-orange-500'
                            )} />
                            {status.replace('_', ' ')} first
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
            
            <Button
              variant="primary"
              onClick={onAddParticipant}
            >
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span className="hidden sm:inline">Add</span>
                <span className="hidden md:inline">Participant</span>
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
            Sorted by: {sortConfig.key === 'age' ? 'Age' : 'Status'}
            {sortConfig.key === 'status' && statusSortPriority && (
              <span className="ml-2">
                ({statusSortPriority.charAt(0).toUpperCase() + statusSortPriority.slice(1)} first)
              </span>
            )}
          </span>
          <button
            onClick={() => {
              setSortConfig({ key: null, direction: 'asc' });
              setStatusSortPriority(null);
            }}
            className="text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-200"
          >
            Clear
          </button>
        </div>
      )}

      {/* Mobile Card View */}
      {isMobile && (
        <div className="space-y-3 md:hidden">
          {paginatedParticipants.map((participant, index) => (
            <MobileDataCard
              key={participant.id}
              onClick={() => handleRowClick(participant)}
            >
              <div className="space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-base">
                      {participant.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {participant.language} • Age {participant.age}
                    </p>
                  </div>
                  <div className="text-right text-sm font-medium text-gray-500 dark:text-gray-400">
                    #{index + 1}
                  </div>
                </div>

                {/* Contact Info */}
                <MobileCardSection>
                  <div className="flex flex-col gap-1 text-sm">
                    <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      {participant.phone_number}
                    </div>
                    <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {participant.city}
                    </div>
                  </div>
                </MobileCardSection>

                {/* Host Info */}
                {participant.host_name ? (
                  <MobileCardSection title="Host">
                    <div className="text-sm">
                      <p className="font-medium text-gray-900 dark:text-gray-100">{participant.host_name}</p>
                      {participant.host_place_name && (
                        <p className="text-gray-600 dark:text-gray-400 text-xs">{participant.host_place_name}</p>
                      )}
                    </div>
                  </MobileCardSection>
                ) : (
                  <div className="text-sm text-gray-500 dark:text-gray-400 italic">
                    No host assigned
                  </div>
                )}

                {/* Status & Transportation */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                  <StatusDropdown
                    currentStatus={participant.status}
                    onStatusChange={(status) => handleStatusUpdate(participant.id, status)}
                    isLoading={updatingStatus === participant.id}
                  />
                  <div className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                    {participant.transportation_mode}
                    {participant.has_empty_seats && (
                      <span className="ml-1 text-green-600 dark:text-green-400">
                        ({participant.available_seats_count} seats)
                      </span>
                    )}
                  </div>
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
              <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100">Name</th>
              <th 
                className="text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 select-none"
                onClick={() => handleSort('age')}
              >
                <div className="flex items-center gap-1">
                  Age
                  {sortConfig.key === 'age' && (
                    <span className="text-xs">
                      {sortConfig.direction === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100">Contact</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100">Details</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100">Transportation</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100">Host Info</th>
              <th 
                className="text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 select-none"
                onClick={() => handleSort('status')}
              >
                <div className="flex items-center gap-1">
                  Status
                  {/* Status indicator - only show selected status dot */}
                  {sortConfig.key === 'status' && statusSortPriority && (
                    <div className="flex items-center gap-1 ml-2">
                      <div
                        className={`w-2 h-2 rounded-full ${statusColors[statusSortPriority]}`}
                        title={`${statusSortPriority.charAt(0).toUpperCase() + statusSortPriority.slice(1)} first`}
                      />
                    </div>
                  )}
                </div>
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100">Group</th>
            </tr>
          </thead>
          <tbody>
            {paginatedParticipants.map((participant, index) => (
              <tr 
                key={participant.id} 
                className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors duration-200"
                onClick={() => handleRowClick(participant)}
              >
                <td className="py-4 px-4 text-left">
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {index + 1}
                  </div>
                </td>
                <td className="py-4 px-4 text-left">
                  <div>
                    <div className="font-medium text-gray-900 dark:text-gray-100">
                      {participant.name}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {participant.language}
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4 text-left">
                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {participant.age}
                  </div>
                </td>
                <td className="py-4 px-4 text-left">
                  <div className="text-sm">
                    <div className="text-gray-900 dark:text-gray-100">{participant.phone_number}</div>
                    <div className="text-gray-500 dark:text-gray-400">{participant.email}</div>
                    <div className="text-gray-500 dark:text-gray-400">{participant.city}</div>
                  </div>
                </td>
                <td className="py-4 px-4 text-left">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <div>Floor: {participant.floor_preference}</div>
                    <div>Toilet: {participant.toilet_preference}</div>
                    {participant.special_requirements && (
                      <div className="text-orange-600 dark:text-orange-400">
                        Special: {participant.special_requirements}
                      </div>
                    )}
                  </div>
                </td>
                <td className="py-4 px-4 text-left">
                  <div className="text-sm">
                    <div className="text-gray-900 dark:text-gray-100 capitalize">
                      {participant.transportation_mode}
                    </div>
                    {participant.has_empty_seats && (
                      <div className="text-green-600 dark:text-green-400 text-xs">
                        {participant.available_seats_count} seats available
                      </div>
                    )}
                  </div>
                </td>
                <td className="py-4 px-4 text-left">
                  <div className="text-sm">
                    {participant.host_name ? (
                      <>
                        <div className="text-gray-900 dark:text-gray-100 font-medium">
                          {participant.host_name}
                        </div>
                        {participant.host_place_name && (
                          <div className="text-gray-600 dark:text-gray-400 text-xs">
                            {participant.host_place_name}
                          </div>
                        )}
                        {participant.host_phone_no && (
                          <div className="text-gray-500 dark:text-gray-500 text-xs">
                            {participant.host_phone_no}
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="text-gray-400 dark:text-gray-500 italic">
                        Not assigned
                      </div>
                    )}
                  </div>
                </td>
                <td className="py-4 px-4 text-left">
                  <StatusDropdown
                    currentStatus={participant.status}
                    onStatusChange={(status) => handleStatusUpdate(participant.id, status)}
                    isLoading={updatingStatus === participant.id}
                  />
                </td>
                <td className="py-4 px-4 text-left">
                  <div className="text-sm">
                    <div className="text-gray-900 dark:text-gray-100">
                      Group #{participant.group_id}
                    </div>
                    <div className="text-gray-500 dark:text-gray-400">
                      {participant.registration_type}
                    </div>
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
          {Math.min(endIndex, filteredParticipants.length)} of{' '}
          {filteredParticipants.length} participants
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

      {/* Participant Details Modal */}
      <ParticipantDetailsModal
        participant={selectedParticipant}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        eventDayId={eventDayId || ''}
        onAssignmentDeleted={handleAssignmentDeleted}
      />
    </Card>
  );
}
