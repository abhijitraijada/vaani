import { useState, useEffect, useCallback } from 'react';
import type { Participant } from '../../services/endpoints/dashboard.types';
import type { Assignment } from '../../services/endpoints/assignment.service';
import { Card } from '../primitives/Layout';
import { Heading, Text } from '../primitives/Typography';
import { Button } from '../primitives/Button';
import { Icon } from '../primitives/Icon';
import { Tooltip } from '../primitives/Tooltip';
import { DeleteAssignmentDialog } from '../shared/DeleteAssignmentDialog';
import { assignmentService } from '../../services/endpoints/assignment.service';
import { useToast } from '../feedback/Toast';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { cn } from '../../lib/cn';

interface ParticipantDetailsModalProps {
  participant: Participant | null;
  isOpen: boolean;
  onClose: () => void;
  eventDayId: string;
  onAssignmentDeleted?: () => void;
}

interface HostAssignmentData {
  assignment: Assignment | null;
  hostName?: string;
  hostPlace?: string;
  hostPhone?: string;
}

export function ParticipantDetailsModal({ 
  participant, 
  isOpen, 
  onClose, 
  eventDayId,
  onAssignmentDeleted 
}: ParticipantDetailsModalProps) {
  const { isMobile } = useMediaQuery();
  const [assignmentData, setAssignmentData] = useState<HostAssignmentData>({ assignment: null });
  const [isLoadingAssignment, setIsLoadingAssignment] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const toast = useToast();

  const fetchAssignmentData = useCallback(async () => {
    if (!participant || !eventDayId) return;
    
    // Always fetch assignment data from API to get the assignment ID for delete functionality
    setIsLoadingAssignment(true);
    try {
      const response = await assignmentService.getAllAssignments({
        registration_member_id: participant.id,
        event_day_id: eventDayId,
        page_size: 1
      });

      if (response.assignments.length > 0) {
        const assignment = response.assignments[0];
        setAssignmentData({ 
          assignment,
          // Use dashboard data if available, otherwise will get from host via assignment
          hostName: participant.host_name,
          hostPlace: participant.host_place_name,
          hostPhone: participant.host_phone_no?.toString()
        });
      } else {
        setAssignmentData({ assignment: null });
      }
    } catch (error) {
      console.error('Failed to fetch assignment data:', error);
      setAssignmentData({ assignment: null });
    } finally {
      setIsLoadingAssignment(false);
    }
  }, [participant, eventDayId]);

  // Fetch assignment data when modal opens
  useEffect(() => {
    if (isOpen && participant && eventDayId) {
      fetchAssignmentData();
    }
  }, [isOpen, participant, eventDayId, fetchAssignmentData]);

  // Early return after all hooks
  if (!isOpen || !participant) return null;

  // Defensive checks to prevent crashes
  if (!participant.id || !eventDayId) {
    console.error('ParticipantDetailsModal: Missing required data', { participant, eventDayId });
    return null;
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString.includes('Z') ? dateString : dateString + 'Z');
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleDeleteAssignment = () => {
    if (assignmentData.assignment) {
      setDeleteDialogOpen(true);
    }
  };

  const handleConfirmDelete = async () => {
    if (!assignmentData.assignment) return;

    setIsDeleting(true);
    const loadingToastId = toast.loading({
      title: 'Removing Assignment',
      description: 'Please wait while we remove the assignment...'
    });

    try {
      await assignmentService.deleteAssignment(assignmentData.assignment.id);
      
      toast.update(loadingToastId, {
        variant: 'success',
        title: 'Assignment Removed',
        description: `${participant.name} has been unassigned from their host`
      });

      setDeleteDialogOpen(false);
      onAssignmentDeleted?.();
      onClose();
      
    } catch (error) {
      console.error('Failed to delete assignment:', error);
      toast.update(loadingToastId, {
        variant: 'error',
        title: 'Removal Failed',
        description: 'Failed to remove the assignment. Please try again.'
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
  };

  const getGenderColor = (gender: 'M' | 'F') => {
    return gender === 'M' 
      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200'
      : 'bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-200';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200';
      case 'waiting': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200';
      case 'registered': return 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400';
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  const getToiletPreferenceColor = (preference: string) => {
    switch (preference) {
      case 'indian': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200';
      case 'western': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-200';
      default: return 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  const getTransportationColor = (mode: string) => {
    switch (mode) {
      case 'private': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200';
      case 'public': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200';
      default: return 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  return (
    <div className={cn(
      'fixed inset-0 bg-black bg-opacity-50 z-50',
      isMobile ? 'flex flex-col' : 'flex items-center justify-center p-4'
    )}>
      <div className={cn(
        'bg-white dark:bg-gray-800 w-full overflow-hidden',
        isMobile 
          ? 'h-full flex flex-col' 
          : 'rounded-lg max-w-4xl max-h-[90vh]'
      )}>
        {/* Header - Sticky on mobile */}
        <div className={cn(
          'flex items-center justify-between p-4 md:p-6 border-b border-gray-200 dark:border-gray-700',
          isMobile && 'sticky top-0 z-10 bg-white dark:bg-gray-800'
        )}>
          <div>
            <Heading className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Participant Details
            </Heading>
            <Text className="text-gray-600 dark:text-gray-400 mt-1">
              {participant.name} • {participant.city}
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

        {/* Content - Flexible on mobile */}
        <div className={cn(
          'overflow-y-auto',
          isMobile 
            ? 'flex-1 p-4' 
            : 'p-6 max-h-[70vh]'
        )}>
          <div className="space-y-4 md:space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
              <Card className="p-4 text-center">
                <Text className="text-sm font-medium text-gray-600 dark:text-gray-400">Age</Text>
                <Text className="text-2xl font-bold text-gray-900 dark:text-gray-100">{participant.age}</Text>
              </Card>
              <Card className="p-4 text-center">
                <Text className="text-sm font-medium text-gray-600 dark:text-gray-400">Gender</Text>
                <div className="mt-1">
                  <span className={cn("px-2 py-1 rounded-full text-xs font-medium", getGenderColor(participant.gender))}>
                    {participant.gender === 'M' ? 'Male' : 'Female'}
                  </span>
                </div>
              </Card>
              <Card className="p-4 text-center">
                <Text className="text-sm font-medium text-gray-600 dark:text-gray-400">Status</Text>
                <div className="mt-1">
                  <span className={cn("px-2 py-1 rounded-full text-xs font-medium", getStatusColor(participant.status))}>
                    {participant.status.charAt(0).toUpperCase() + participant.status.slice(1)}
                  </span>
                </div>
              </Card>
              <Card className="p-4 text-center">
                <Text className="text-sm font-medium text-gray-600 dark:text-gray-400">Registration</Text>
                <Text className="text-sm font-medium text-gray-900 dark:text-gray-100 mt-1">
                  {participant.registration_type.charAt(0).toUpperCase() + participant.registration_type.slice(1)}
                </Text>
              </Card>
            </div>

            {/* Personal Information */}
            <Card className="p-4">
              <Heading className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Personal Information
              </Heading>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Text className="text-sm font-medium text-gray-700 dark:text-gray-300">Name</Text>
                  <Text className="text-gray-900 dark:text-gray-100">{participant.name}</Text>
                </div>
                <div>
                  <Text className="text-sm font-medium text-gray-700 dark:text-gray-300">Phone</Text>
                  <Text className="text-gray-900 dark:text-gray-100">{participant.phone_number}</Text>
                </div>
                <div>
                  <Text className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</Text>
                  <Text className="text-gray-900 dark:text-gray-100">{participant.email}</Text>
                </div>
                <div>
                  <Text className="text-sm font-medium text-gray-700 dark:text-gray-300">City</Text>
                  <Text className="text-gray-900 dark:text-gray-100">{participant.city}</Text>
                </div>
                <div>
                  <Text className="text-sm font-medium text-gray-700 dark:text-gray-300">Language</Text>
                  <Text className="text-gray-900 dark:text-gray-100">{participant.language}</Text>
                </div>
                <div>
                  <Text className="text-sm font-medium text-gray-700 dark:text-gray-300">Group ID</Text>
                  <Text className="text-gray-900 dark:text-gray-100">{participant.group_id}</Text>
                </div>
              </div>
            </Card>

            {/* Preferences */}
            <Card className="p-4">
              <Heading className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Preferences
              </Heading>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Text className="text-sm font-medium text-gray-700 dark:text-gray-300">Floor Preference</Text>
                  <Text className="text-gray-900 dark:text-gray-100">{participant.floor_preference}</Text>
                </div>
                <div>
                  <Text className="text-sm font-medium text-gray-700 dark:text-gray-300">Toilet Preference</Text>
                  <span className={cn("px-2 py-1 rounded-full text-xs font-medium", getToiletPreferenceColor(participant.toilet_preference))}>
                    {participant.toilet_preference.charAt(0).toUpperCase() + participant.toilet_preference.slice(1)}
                  </span>
                </div>
                {participant.special_requirements && (
                  <div className="md:col-span-2">
                    <Text className="text-sm font-medium text-gray-700 dark:text-gray-300">Special Requirements</Text>
                    <Text className="text-gray-900 dark:text-gray-100">{participant.special_requirements}</Text>
                  </div>
                )}
                {participant.physical_limitations && (
                  <div className="md:col-span-2">
                    <Text className="text-sm font-medium text-gray-700 dark:text-gray-300">Physical Limitations</Text>
                    <Text className="text-gray-900 dark:text-gray-100">{participant.physical_limitations}</Text>
                  </div>
                )}
              </div>
            </Card>

            {/* Meal Preferences */}
            <Card className="p-4">
              <Heading className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Meal Preferences
              </Heading>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <Text className="text-sm font-medium text-gray-700 dark:text-gray-300">Staying with Yatra</Text>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium mt-1 ${participant.staying_with_yatra ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'}`}>
                    {participant.staying_with_yatra ? 'Yes' : 'No'}
                  </div>
                </div>
                <div className="text-center">
                  <Text className="text-sm font-medium text-gray-700 dark:text-gray-300">Dinner at Host</Text>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium mt-1 ${participant.dinner_at_host ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'}`}>
                    {participant.dinner_at_host ? 'Yes' : 'No'}
                  </div>
                </div>
                <div className="text-center">
                  <Text className="text-sm font-medium text-gray-700 dark:text-gray-300">Breakfast at Host</Text>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium mt-1 ${participant.breakfast_at_host ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'}`}>
                    {participant.breakfast_at_host ? 'Yes' : 'No'}
                  </div>
                </div>
                <div className="text-center">
                  <Text className="text-sm font-medium text-gray-700 dark:text-gray-300">Lunch with Yatra</Text>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium mt-1 ${participant.lunch_with_yatra ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'}`}>
                    {participant.lunch_with_yatra ? 'Yes' : 'No'}
                  </div>
                </div>
              </div>
            </Card>

            {/* Transportation */}
            <Card className="p-4">
              <Heading className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Transportation
              </Heading>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Text className="text-sm font-medium text-gray-700 dark:text-gray-300">Transportation Mode</Text>
                  <span className={cn("px-2 py-1 rounded-full text-xs font-medium", getTransportationColor(participant.transportation_mode))}>
                    {participant.transportation_mode.charAt(0).toUpperCase() + participant.transportation_mode.slice(1)}
                  </span>
                </div>
                <div>
                  <Text className="text-sm font-medium text-gray-700 dark:text-gray-300">Has Empty Seats</Text>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium mt-1 ${participant.has_empty_seats ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'}`}>
                    {participant.has_empty_seats ? 'Yes' : 'No'}
                  </div>
                </div>
                {participant.has_empty_seats && (
                  <div>
                    <Text className="text-sm font-medium text-gray-700 dark:text-gray-300">Available Seats</Text>
                    <Text className="text-gray-900 dark:text-gray-100">{participant.available_seats_count}</Text>
                  </div>
                )}
              </div>
            </Card>

            {/* Host Assignment */}
            <Card className="p-4">
              <Heading className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Host Assignment
              </Heading>
              {isLoadingAssignment ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-2"></div>
                  <Text className="text-gray-600 dark:text-gray-400">Loading assignment...</Text>
                </div>
              ) : (assignmentData.assignment || assignmentData.hostName) ? (
                <div className="space-y-4">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <Text className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                          Assigned to Host
                        </Text>
                        
                        {/* Host details from dashboard data */}
                        {assignmentData.hostName && (
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <Icon name="user-plus" width={16} height={16} className="text-blue-600 dark:text-blue-400" />
                              <Text className="text-sm font-medium text-blue-800 dark:text-blue-200">
                                {assignmentData.hostName}
                              </Text>
                            </div>
                            {assignmentData.hostPlace && (
                              <div className="flex items-center gap-2">
                                <Icon name="search" width={16} height={16} className="text-blue-600 dark:text-blue-400" />
                                <Text className="text-sm text-blue-700 dark:text-blue-300">
                                  {assignmentData.hostPlace}
                                </Text>
                              </div>
                            )}
                            {assignmentData.hostPhone && (
                              <div className="flex items-center gap-2">
                                <Icon name="check" width={16} height={16} className="text-blue-600 dark:text-blue-400" />
                                <Text className="text-sm text-blue-700 dark:text-blue-300">
                                  {assignmentData.hostPhone}
                                </Text>
                              </div>
                            )}
                          </div>
                        )}
                        
                        {/* Assignment details from API (if available) */}
                        {assignmentData.assignment && (
                          <div className="mt-3 pt-3 border-t border-blue-200 dark:border-blue-700">
                            <Text className="text-sm text-blue-700 dark:text-blue-300">
                              Assignment ID: {assignmentData.assignment.id.substring(0, 8)}...
                            </Text>
                            <Text className="text-sm text-blue-700 dark:text-blue-300">
                              Assigned: {formatDate(assignmentData.assignment.created_at)}
                            </Text>
                            {assignmentData.assignment.assignment_notes && (
                              <div className="mt-2">
                                <Text className="text-sm font-medium text-blue-800 dark:text-blue-200">Notes:</Text>
                                <Text className="text-sm text-blue-700 dark:text-blue-300">
                                  {assignmentData.assignment.assignment_notes}
                                </Text>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      
                      {/* Delete button only available if we have assignment data from API */}
                      {assignmentData.assignment && (
                        <Tooltip label="Remove Assignment">
                          <Button
                            variant="icon"
                            size="sm"
                            onClick={handleDeleteAssignment}
                            className="w-8 h-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20"
                          >
                            <Icon name="trash" width={16} height={16} />
                          </Button>
                        </Tooltip>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Icon name="user-plus" width={48} height={48} className="text-gray-400 mx-auto mb-3" />
                  <Text className="text-gray-500 dark:text-gray-400">
                    No host assignment for this day
                  </Text>
                </div>
              )}
            </Card>

            {/* Notes */}
            {participant.notes && (
              <Card className="p-4">
                <Heading className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Additional Notes
                </Heading>
                <Text className="text-gray-900 dark:text-gray-100">{participant.notes}</Text>
              </Card>
            )}

            {/* Timestamps */}
            <Card className="p-4">
              <Heading className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Registration Details
              </Heading>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Text className="text-sm font-medium text-gray-700 dark:text-gray-300">Created</Text>
                  <Text className="text-gray-900 dark:text-gray-100">{formatDate(participant.created_at)}</Text>
                </div>
                <div>
                  <Text className="text-sm font-medium text-gray-700 dark:text-gray-300">Last Updated</Text>
                  <Text className="text-gray-900 dark:text-gray-100">{formatDate(participant.updated_at)}</Text>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Footer - Sticky on mobile */}
        <div className={cn(
          'flex items-center justify-between p-4 md:p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50',
          isMobile && 'sticky bottom-0'
        )}>
          <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
            ID: {participant.id.substring(0, 8)}...
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={onClose} className={isMobile ? 'text-sm' : ''}>
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
        participantName={participant.name}
        hostName="Host"
        isLoading={isDeleting}
      />
    </div>
  );
}