import { useState, useMemo, useEffect } from 'react';
import type { Participant } from '../../services/endpoints/dashboard.types';
import { Card } from '../primitives/Layout';
import { Heading } from '../primitives/Typography';
import { Button } from '../primitives/Button';
import { ExportButton } from '../export';
import { StatusDropdown } from './StatusDropdown';
import { ParticipantDetailsModal } from './ParticipantDetailsModal';
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
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: 'age' | null; direction: 'asc' | 'desc' }>({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const pageSize = 50;

  // Modal state
  const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSort = (key: 'age') => {
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
        }
        return 0;
      });
    }

    return filtered;
  }, [participants, searchTerm, sortConfig]);

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
            <Button
              variant="primary"
              onClick={onAddParticipant}
            >
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Add Participant</span>
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

      {/* Table */}
      <div className="overflow-x-auto relative">
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
              <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100">Status</th>
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
                    {participant.has_empty_seats && (
                      <div className="text-green-600 dark:text-green-400">
                        {participant.available_seats_count} seats available
                      </div>
                    )}
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
