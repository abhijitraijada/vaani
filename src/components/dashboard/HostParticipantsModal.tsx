import { useState } from 'react';
import type { HostWithAssignments, AssignedParticipant } from '../../services/endpoints/host.types';
import { Card } from '../primitives/Layout';
import { Heading, Text } from '../primitives/Typography';
import { Button } from '../primitives/Button';
import { Icon } from '../primitives/Icon';
import { Tooltip } from '../primitives/Tooltip';
import { DeleteAssignmentDialog } from '../shared/DeleteAssignmentDialog';
import { assignmentService } from '../../services/endpoints/assignment.service';
import { useToast } from '../feedback/Toast';
import { cn } from '../../lib/cn';

interface HostParticipantsModalProps {
  host: HostWithAssignments | null;
  isOpen: boolean;
  onClose: () => void;
  onAssignmentDeleted?: () => void;
}

export function HostParticipantsModal({ host, isOpen, onClose, onAssignmentDeleted }: HostParticipantsModalProps) {
  const [selectedParticipant, setSelectedParticipant] = useState<AssignedParticipant | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [participantToDelete, setParticipantToDelete] = useState<AssignedParticipant | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const toast = useToast();

  if (!isOpen || !host) return null;

  const formatDate = (dateString: string) => {
    // Handle dates with or without timezone info
    const date = new Date(dateString.includes('Z') ? dateString : dateString + 'Z');
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleDeleteParticipant = (participant: AssignedParticipant) => {
    setParticipantToDelete(participant);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!participantToDelete || !host) return;

    setIsDeleting(true);
    const loadingToastId = toast.loading({
      title: 'Removing Assignment',
      description: 'Please wait while we remove the participant...'
    });

    try {
      await assignmentService.deleteAssignment(participantToDelete.assignment_id);
      
      toast.update(loadingToastId, {
        variant: 'success',
        title: 'Assignment Removed',
        description: `${participantToDelete.name} has been removed from ${host.name}`
      });

      // Close the delete dialog
      setDeleteDialogOpen(false);
      setParticipantToDelete(null);
      
      // Notify parent component that an assignment was deleted
      onAssignmentDeleted?.();
      
      // Close the modal to refresh data
      onClose();
      
    } catch (error) {
      console.error('Failed to delete assignment:', error);
      toast.update(loadingToastId, {
        variant: 'error',
        title: 'Removal Failed',
        description: 'Failed to remove the participant. Please try again.'
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setParticipantToDelete(null);
  };

  const getGenderColor = (gender: 'M' | 'F') => {
    return gender === 'M' 
      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200'
      : 'bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-200';
  };

  const getSpecialRequirementsColor = (hasRequirements: boolean) => {
    return hasRequirements 
      ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-200'
      : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <Heading className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Assigned Participants
            </Heading>
            <Text className="text-gray-600 dark:text-gray-400 mt-1">
              {host.name} • {host.place_name}
            </Text>
          </div>
          <Button
            variant="icon"
            size="sm"
            onClick={onClose}
            className="w-8 h-8 p-0 text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700"
          >
            <Icon name="x" width={20} height={20} />
          </Button>
        </div>

        {/* Host Info Summary */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <Text className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Capacity</Text>
              <Text className="text-lg font-bold text-gray-900 dark:text-gray-100">{host.max_participants}</Text>
            </div>
            <div className="text-center">
              <Text className="text-sm font-medium text-gray-600 dark:text-gray-400">Assigned</Text>
              <Text className="text-lg font-bold text-blue-600 dark:text-blue-400">{host.current_capacity}</Text>
            </div>
            <div className="text-center">
              <Text className="text-sm font-medium text-gray-600 dark:text-gray-400">Available</Text>
              <Text className="text-lg font-bold text-green-600 dark:text-green-400">{host.available_capacity}</Text>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {host.assigned_participants.length === 0 ? (
            <div className="text-center py-12">
              <Icon name="user-plus" width={64} height={64} className="text-gray-400 mx-auto mb-4" />
              <Heading className="text-lg text-gray-500 dark:text-gray-400 mb-2">
                No Participants Assigned
              </Heading>
              <Text className="text-gray-400 dark:text-gray-500">
                This host doesn't have any participants assigned yet.
              </Text>
            </div>
          ) : (
            <div className="space-y-4">
              {host.assigned_participants.map((participant) => (
                <Card 
                  key={participant.id} 
                  className={cn(
                    "p-4 cursor-pointer transition-all duration-200",
                    selectedParticipant?.id === participant.id 
                      ? "ring-2 ring-purple-500 bg-purple-50 dark:bg-purple-900/20" 
                      : "hover:bg-gray-50 dark:hover:bg-gray-700"
                  )}
                  onClick={() => setSelectedParticipant(
                    selectedParticipant?.id === participant.id ? null : participant
                  )}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Heading className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                          {participant.name}
                        </Heading>
                        <span className={cn("px-2 py-1 rounded-full text-xs font-medium", getGenderColor(participant.gender))}>
                          {participant.gender === 'M' ? 'Male' : 'Female'}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          Age: {participant.age}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <div>📞 {participant.phone_number}</div>
                        <div>🏙️ {participant.city}</div>
                        <div>📅 Assigned: {formatDate(participant.assigned_at)}</div>
                        <div>🆔 Assignment ID: {participant.assignment_id.substring(0, 8)}...</div>
                      </div>

                      {participant.special_requirements && (
                        <div className="mt-2">
                          <span className={cn("px-2 py-1 rounded-full text-xs font-medium", getSpecialRequirementsColor(true))}>
                            ⚠️ Special Requirements: {participant.special_requirements}
                          </span>
                        </div>
                      )}

                      {participant.assignment_notes && (
                        <div className="mt-2">
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200">
                            📝 Notes: {participant.assignment_notes}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div className="ml-4 flex items-center gap-2">
                      <Tooltip label="Remove Assignment">
                        <Button
                          variant="icon"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteParticipant(participant);
                          }}
                          className="w-8 h-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20"
                        >
                          <Icon name="trash" width={16} height={16} />
                        </Button>
                      </Tooltip>
                      <Icon 
                        name="chevron-down" 
                        width={20} 
                        height={20} 
                        className={cn(
                          "text-gray-400 transition-transform duration-200",
                          selectedParticipant?.id === participant.id && "rotate-180"
                        )}
                      />
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {selectedParticipant?.id === participant.id && (
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Assignment Details
                          </Text>
                          <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                            <div>Assignment ID: {participant.assignment_id}</div>
                            <div>Assigned At: {formatDate(participant.assigned_at)}</div>
                          </div>
                        </div>
                        
                        <div>
                          <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Contact Information
                          </Text>
                          <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                            <div>Phone: {participant.phone_number}</div>
                            <div>City: {participant.city}</div>
                            <div>Age: {participant.age} years</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {host.assigned_participants.length} participant{host.assigned_participants.length !== 1 ? 's' : ''} assigned
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </div>

      {/* Delete Assignment Dialog */}
      <DeleteAssignmentDialog
        isOpen={deleteDialogOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        participantName={participantToDelete?.name || ''}
        hostName={host.name}
        isLoading={isDeleting}
      />
    </div>
  );
}
