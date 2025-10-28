import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppSelector } from '../store';
import { Sidebar } from '../components/navigation/Sidebar';
import { DashboardHeader } from '../components/navigation/DashboardHeader';
import { Card } from '../components/primitives/Layout';
import { Heading, Text } from '../components/primitives/Typography';
import { Button } from '../components/primitives/Button';
import { Icon } from '../components/primitives/Icon';
import { Tooltip } from '../components/primitives/Tooltip';
import { hostService } from '../services/endpoints/host.service';
import { assignmentService } from '../services/endpoints/assignment.service';
import { DeleteAssignmentDialog } from '../components/shared/DeleteAssignmentDialog';
import { useToast } from '../components/feedback/Toast';
import type { HostWithAssignments } from '../services/endpoints/host.types';
import type { Participant } from '../services/endpoints/dashboard.types';
import type { BulkAssignmentRequest, Assignment } from '../services/endpoints/assignment.service';

export default function AddParticipants() {
  const { hostId } = useParams<{ hostId: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  
  const [host, setHost] = useState<HostWithAssignments | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedParticipants, setSelectedParticipants] = useState<Record<string, boolean>>({});
  
  // Assignment state management
  const [isAssigning, setIsAssigning] = useState(false);
  const [assignmentError, setAssignmentError] = useState<string | null>(null);
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [assignmentNotes, setAssignmentNotes] = useState('');
  
  // Delete assignment state management
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [participantToDelete, setParticipantToDelete] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Assignments data state
  const [allAssignments, setAllAssignments] = useState<Assignment[]>([]);
  const [isLoadingAssignments, setIsLoadingAssignments] = useState(false);
  const [assignmentsError, setAssignmentsError] = useState<string | null>(null);
  
  // Search state
  const [searchTerm, setSearchTerm] = useState('');
  
  // Tab state for participant status filtering
  const [activeTab, setActiveTab] = useState<'assignable' | 'other'>('assignable');
  
  // Sidebar state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Get Redux data
  const { eventData } = useAppSelector((state) => state.dashboard);

  // Add admin-layout class to root element for full-width layout
  useEffect(() => {
    const rootElement = document.getElementById('root');
    if (rootElement) {
      rootElement.classList.add('admin-layout');
    }
    
    // Cleanup: remove class when component unmounts
    return () => {
      if (rootElement) {
        rootElement.classList.remove('admin-layout');
      }
    };
  }, []);

  useEffect(() => {
    const fetchHostDetails = async () => {
      if (!hostId) {
        setError('Host ID is required');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const hostData = await hostService.getHost(hostId);
        
        // Convert to HostWithAssignments format
        const hostWithAssignments: HostWithAssignments = {
          ...hostData,
          assignments: [], // Legacy field - we now use assigned_participants
          // current_capacity and available_capacity are now part of Host interface
        };
        
        setHost(hostWithAssignments);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch host details:', err);
        setError('Failed to load host details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchHostDetails();
  }, [hostId]);

  // Fetch all assignments to filter out already assigned participants
  useEffect(() => {
    const fetchAllAssignments = async () => {
      try {
        setIsLoadingAssignments(true);
        setAssignmentsError(null);
        
        // Fetch all assignments for the current event day
        const assignmentsResponse = await assignmentService.getAllAssignments({
          event_day_id: host?.event_days_id,
          page_size: 1000 // Get all assignments for the event day
        });
        
        setAllAssignments(assignmentsResponse.assignments);
      } catch (err) {
        console.error('Failed to fetch assignments:', err);
        setAssignmentsError('Failed to load assignment data');
        // Don't block the UI if assignments fail to load
        setAllAssignments([]);
      } finally {
        setIsLoadingAssignments(false);
      }
    };

    if (host?.event_days_id) {
      fetchAllAssignments();
    }
  }, [host?.event_days_id]);

  const handleBackToHosts = () => {
    navigate('/hosts');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        <DashboardHeader pageName="Add Participants" onMenuClick={() => setIsSidebarOpen(true)} />
        <div className="ml-0 md:ml-64 flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <Text>Loading host details...</Text>
          </div>
        </div>
      </div>
    );
  }

  if (error || !host) {
    return (
      <div className="min-h-screen">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        <DashboardHeader pageName="Add Participants" onMenuClick={() => setIsSidebarOpen(true)} />
        <div className="ml-0 md:ml-64 flex items-center justify-center h-64">
          <div className="text-center">
            <Icon name="x" width={48} height={48} className="text-red-500 mx-auto mb-4" />
            <Heading className="text-xl text-red-600 dark:text-red-400 mb-2">
              {error || 'Host not found'}
            </Heading>
            <Button onClick={handleBackToHosts} variant="primary">
              Back to Hosts
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const occupiedSeats = host.current_capacity;
  const emptySeats = host.available_capacity;

  // Helper functions for participant selection
  const handleParticipantSelect = (participantId: string, isSelected: boolean) => {
    setSelectedParticipants(prev => ({
      ...prev,
      [participantId]: isSelected
    }));
  };

  const getSelectedCountInGroup = (participants: Participant[]) => {
    return participants.filter(p => selectedParticipants[p.id]).length;
  };

  const handleGroupAssign = (participants: Participant[]) => {
    const selectedCount = getSelectedCountInGroup(participants);
    const isAllSelected = selectedCount === participants.length;
    
    if (isAllSelected) {
      // Deselect all in group
      const newSelection = { ...selectedParticipants };
      participants.forEach(p => {
        delete newSelection[p.id];
      });
      setSelectedParticipants(newSelection);
    } else {
      // Select all in group
      const newSelection = { ...selectedParticipants };
      participants.forEach(p => {
        newSelection[p.id] = true;
      });
      setSelectedParticipants(newSelection);
    }
  };

  // Assignment validation and handlers
  const validateAssignment = () => {
    const selectedCount = Object.values(selectedParticipants).filter(Boolean).length;
    
    if (selectedCount === 0) {
      toast.error({ 
        title: 'No Selection', 
        description: 'Please select at least one participant to assign' 
      });
      return false;
    }
    
    if (selectedCount > host.available_capacity) {
      toast.error({ 
        title: 'Capacity Exceeded', 
        description: `Cannot assign ${selectedCount} participants. Only ${host.available_capacity} seats available` 
      });
      return false;
    }
    
    return true;
  };

  const handleAssignParticipants = () => {
    if (!validateAssignment()) return;
    
    setShowConfirmationDialog(true);
    setAssignmentError(null);
  };

  const handleConfirmAssignment = async () => {
    if (!host || !hostId) return;
    
    setIsAssigning(true);
    setAssignmentError(null);
    
    const loadingToastId = toast.loading({ 
      title: 'Assigning Participants', 
      description: 'Please wait while we assign participants...' 
    });
    
    try {
      const selectedParticipantIds = Object.entries(selectedParticipants)
        .filter(([_, isSelected]) => isSelected)
        .map(([participantId, _]) => participantId);
      
      const assignmentRequest: BulkAssignmentRequest = {
        host_id: hostId,
        registration_member_ids: selectedParticipantIds,
        event_day_id: host.event_days_id,
        assignment_notes: assignmentNotes.trim() || undefined
      };
      
      const response = await assignmentService.createBulkHostAssignments(assignmentRequest);
      
      // Handle response
      if (response.successful_assignments > 0) {
        toast.update(loadingToastId, { 
          variant: 'success', 
          title: 'Assignment Successful', 
          description: `Successfully assigned ${response.successful_assignments} participants` 
        });
        
        // Update host capacity and refresh host data
        const updatedHost = {
          ...host,
          current_capacity: host.current_capacity + response.successful_assignments,
          available_capacity: host.available_capacity - response.successful_assignments
        };
        setHost(updatedHost);
        
        // Refresh host data to get updated assigned participants
        try {
          const refreshedHostData = await hostService.getHost(hostId);
          const refreshedHostWithAssignments: HostWithAssignments = {
            ...refreshedHostData,
            assignments: [], // Legacy field
          };
          setHost(refreshedHostWithAssignments);
        } catch (refreshError) {
          console.error('Failed to refresh host data:', refreshError);
          // Keep the updated capacity even if refresh fails
        }
        
        // Refresh assignments data to update participant filtering
        await refreshAssignmentsData();
        
        // Clear selections
        setSelectedParticipants({});
        setAssignmentNotes('');
      }
      
      if (response.failed_assignments > 0) {
        const failedReasons = response.errors.join(', ');
        toast.error({ 
          title: 'Partial Assignment Failure', 
          description: `Failed to assign ${response.failed_assignments} participants: ${failedReasons}` 
        });
      }
      
      setShowConfirmationDialog(false);
      
    } catch (error) {
      console.error('Assignment failed:', error);
      setAssignmentError('Failed to assign participants. Please try again.');
      toast.update(loadingToastId, { 
        variant: 'error', 
        title: 'Assignment Failed', 
        description: 'Failed to assign participants. Please try again.' 
      });
    } finally {
      setIsAssigning(false);
    }
  };

  const handleCancelAssignment = () => {
    setShowConfirmationDialog(false);
    setAssignmentNotes('');
    setAssignmentError(null);
  };

  const handleDeleteParticipant = (participant: any) => {
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
      
      // Refresh host data to get updated assigned participants
      try {
        const refreshedHostData = await hostService.getHost(hostId!);
        const refreshedHostWithAssignments: HostWithAssignments = {
          ...refreshedHostData,
          assignments: [], // Legacy field
        };
        setHost(refreshedHostWithAssignments);
      } catch (refreshError) {
        console.error('Failed to refresh host data:', refreshError);
        // Keep the updated capacity even if refresh fails
      }
      
      // Refresh assignments data to update participant filtering
      await refreshAssignmentsData();
      
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

  // Refresh assignments data
  const refreshAssignmentsData = async () => {
    if (!host?.event_days_id) return;
    
    try {
      const assignmentsResponse = await assignmentService.getAllAssignments({
        event_day_id: host.event_days_id,
        page_size: 1000
      });
      setAllAssignments(assignmentsResponse.assignments);
    } catch (error) {
      console.error('Failed to refresh assignments:', error);
    }
  };

  // Create a Set of assigned participant IDs for quick lookup
  const assignedParticipantIds = new Set(
    allAssignments.map(assignment => assignment.registration_member_id)
  );

  // Filter participants to exclude already assigned ones
  const filterAssignedParticipants = (participants: Participant[]) => {
    return participants.filter(participant => 
      !assignedParticipantIds.has(participant.id)
    );
  };

  // Filter participants by assignable status (registered and confirmed)
  const filterByAssignableStatus = (participants: Participant[]) => {
    return participants.filter(participant => 
      participant.status === 'registered' || participant.status === 'confirmed'
    );
  };

  // Filter participants by other status (waiting and cancelled, sorted with waiting first)
  const filterByOtherStatus = (participants: Participant[]) => {
    return participants
      .filter(participant => 
        participant.status === 'waiting' || participant.status === 'cancelled'
      )
      .sort((a, b) => {
        // Sort waiting participants first, then cancelled
        if (a.status === 'waiting' && b.status === 'cancelled') return -1;
        if (a.status === 'cancelled' && b.status === 'waiting') return 1;
        return 0;
      });
  };

  // Search functionality
  const matchesSearch = (participant: Participant, searchTerm: string): boolean => {
    if (!searchTerm.trim()) return true;
    
    const term = searchTerm.toLowerCase();
    return (
      participant.name.toLowerCase().includes(term) ||
      participant.phone_number.toLowerCase().includes(term) ||
      participant.city.toLowerCase().includes(term) ||
      participant.toilet_preference.toLowerCase().includes(term) ||
      (participant.special_requirements && participant.special_requirements.toLowerCase().includes(term)) || false
    );
  };

  const searchGroups = (participants: Participant[], searchTerm: string): Set<number> => {
    const matchingGroups = new Set<number>();
    
    participants.forEach(participant => {
      if (matchesSearch(participant, searchTerm)) {
        matchingGroups.add(participant.group_id);
      }
    });
    
    return matchingGroups;
  };

  const filterGroupsBySearch = (groups: Record<number, Participant[]>, searchTerm: string): Record<number, Participant[]> => {
    if (!searchTerm.trim()) return groups;
    
    const matchingGroupIds = searchGroups(Object.values(groups).flat(), searchTerm);
    const filteredGroups: Record<number, Participant[]> = {};
    
    Object.entries(groups).forEach(([groupId, participants]) => {
      if (matchingGroupIds.has(parseInt(groupId))) {
        filteredGroups[parseInt(groupId)] = participants;
      }
    });
    
    return filteredGroups;
  };

  // Check compatibility between participant and host
  const checkCompatibility = (participant: Participant, host: HostWithAssignments) => {
    // Updated toilet matching logic:
    // - If host has 'both' toilets: can accommodate any participant
    // - If host has 'western' toilets: can accommodate both 'western' and 'indian' participants
    // - If host has 'indian' toilets: can only accommodate 'indian' participants
    const toiletMatch = host.toilet_facilities === 'both' || 
      host.toilet_facilities === 'western' ||
      (host.toilet_facilities === 'indian' && participant.toilet_preference === 'indian');
    
    // Convert participant gender to host gender preference format
    const participantGender = participant.gender === 'M' ? 'male' : 'female';
    const genderMatch = host.gender_preference === 'both' ||
      host.gender_preference === participantGender;
    
    if (toiletMatch && genderMatch) {
      return { isCompatible: true };
    }
    
    const reasons = [];
    if (!toiletMatch) reasons.push('toilet');
    if (!genderMatch) reasons.push('gender');
    
    return { 
      isCompatible: false, 
      reason: reasons.join(' and ') + ' mismatch' 
    };
  };

  // Type for participants with compatibility information
  type ParticipantWithCompatibility = Participant & { incompatibilityReason?: string };

  // Group participants by group_id first, then classify within groups
  const groupParticipants = (participants: Participant[]) => {
    return participants.reduce((groups, participant) => {
      const groupId = participant.group_id;
      if (!groups[groupId]) {
        groups[groupId] = [];
      }
      groups[groupId].push(participant);
      return groups;
    }, {} as Record<number, Participant[]>);
  };

  // Classify participants within groups and determine group visibility
  const classifyParticipantsByGroup = (participants: Participant[], host: HostWithAssignments) => {
    const groups = groupParticipants(participants);
    const visibleGroups: Record<number, ParticipantWithCompatibility[]> = {};
    const hiddenGroups: Record<number, ParticipantWithCompatibility[]> = {};
    
    Object.entries(groups).forEach(([groupId, groupParticipants]) => {
      const classifiedGroup: ParticipantWithCompatibility[] = [];
      let hasCompatibleParticipant = false;
      
      groupParticipants.forEach(participant => {
        const compatibility = checkCompatibility(participant, host);
        if (compatibility.isCompatible) {
          classifiedGroup.push(participant);
          hasCompatibleParticipant = true;
        } else {
          classifiedGroup.push({ 
            ...participant, 
            incompatibilityReason: compatibility.reason || 'Unknown mismatch' 
          });
        }
      });
      
      // If group has at least one compatible participant, show the whole group
      if (hasCompatibleParticipant) {
        visibleGroups[parseInt(groupId)] = classifiedGroup;
      } else {
        hiddenGroups[parseInt(groupId)] = classifiedGroup;
      }
    });
    
    return { visibleGroups, hiddenGroups };
  };

  // Get participants for host's event day
  const hostEventDay = eventData?.daily_schedule.find(
    day => day.event_day_id === host.event_days_id
  );

  // Check if participant data is available
  if (!eventData || !hostEventDay) {
    useEffect(() => {
      navigate('/dashboard');
      console.error('Participant data not available. Please try again.');
    }, [navigate]);
    return null;
  }

  // Filter participants by status based on active tab, then filter out already assigned ones
  const statusFilteredParticipants = activeTab === 'assignable' 
    ? filterByAssignableStatus(hostEventDay.participants)
    : filterByOtherStatus(hostEventDay.participants);
  
  const availableParticipants = filterAssignedParticipants(statusFilteredParticipants);
  
  // Classify participants by group visibility (only available participants)
  const { visibleGroups, hiddenGroups } = classifyParticipantsByGroup(availableParticipants, host);
  
  // Apply search filter to groups
  const filteredVisibleGroups = filterGroupsBySearch(visibleGroups, searchTerm);
  const filteredHiddenGroups = filterGroupsBySearch(hiddenGroups, searchTerm);
  
  // Calculate totals for display (using filtered groups)
  const totalVisibleParticipants = Object.values(filteredVisibleGroups).flat().length;
  const totalHiddenParticipants = Object.values(filteredHiddenGroups).flat().length;
  
  // Calculate assignment statistics based on active tab
  const totalParticipants = statusFilteredParticipants.length;
  const assignedParticipantsCount = totalParticipants - availableParticipants.length;
  const availableParticipantsCount = availableParticipants.length;

  return (
    <div className="min-h-screen">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <DashboardHeader pageName="Add Participants" onMenuClick={() => setIsSidebarOpen(true)} />
      
      <main className="ml-0 md:ml-64 overflow-y-auto">
        <div className="p-4 md:p-6 space-y-4 md:space-y-6">

          {/* Host Information Card */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <Heading className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  {host.name}
                </Heading>
                <Text className="text-gray-600 dark:text-gray-400">
                  📞 {host.phone_no}
                </Text>
                <Text className="text-gray-600 dark:text-gray-400">
                  📍 {host.place_name}
                </Text>
              </div>
              <div className="text-right">
                <Text className="text-sm text-gray-500 dark:text-gray-400">
                  {occupiedSeats}/{host.max_participants} participants
                </Text>
              </div>
            </div>

            {/* Host Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                <Text className="text-sm font-medium text-purple-600 dark:text-purple-400">Total Capacity</Text>
                <Text className="text-2xl font-bold text-purple-900 dark:text-purple-100">{host.max_participants}</Text>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <Text className="text-sm font-medium text-green-600 dark:text-green-400">Occupied Seats</Text>
                <Text className="text-2xl font-bold text-green-900 dark:text-green-100">{occupiedSeats}</Text>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <Text className="text-sm font-medium text-blue-600 dark:text-blue-400">Available Seats</Text>
                <Text className="text-2xl font-bold text-blue-900 dark:text-blue-100">{emptySeats}</Text>
              </div>
            </div>

          </Card>

          {/* Participant Status Tabs */}
          <Card className="p-6">
            <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
              <button
                onClick={() => {
                  setActiveTab('assignable');
                  setSelectedParticipants({}); // Clear selections when switching tabs
                }}
                className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
                  activeTab === 'assignable'
                    ? 'bg-white dark:bg-gray-700 text-purple-600 dark:text-purple-400 shadow-sm'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                Assignable Participants ({filterByAssignableStatus(hostEventDay.participants).length})
              </button>
              <button
                onClick={() => {
                  setActiveTab('other');
                  setSelectedParticipants({}); // Clear selections when switching tabs
                }}
                className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
                  activeTab === 'other'
                    ? 'bg-white dark:bg-gray-700 text-purple-600 dark:text-purple-400 shadow-sm'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                Other Participants ({filterByOtherStatus(hostEventDay.participants).length})
              </button>
            </div>
          </Card>

          {/* Participant Assignment Statistics */}
          <Card className="p-6">
            <Heading className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Participant Assignment Overview
            </Heading>
            
            {isLoadingAssignments ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mr-3"></div>
                <Text>Loading assignment data...</Text>
              </div>
            ) : assignmentsError ? (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <Text className="text-red-600 dark:text-red-400">
                  ⚠️ {assignmentsError}
                </Text>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <Text className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Participants</Text>
                  <Text className="text-2xl font-bold text-gray-900 dark:text-gray-100">{totalParticipants}</Text>
                </div>
                <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
                  <Text className="text-sm font-medium text-orange-600 dark:text-orange-400">Already Assigned</Text>
                  <Text className="text-2xl font-bold text-orange-900 dark:text-orange-100">{assignedParticipantsCount}</Text>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                  <Text className="text-sm font-medium text-green-600 dark:text-green-400">Available</Text>
                  <Text className="text-2xl font-bold text-green-900 dark:text-green-100">{availableParticipantsCount}</Text>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <Text className="text-sm font-medium text-blue-600 dark:text-blue-400">Assignment Rate</Text>
                  <Text className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                    {totalParticipants > 0 ? Math.round((assignedParticipantsCount / totalParticipants) * 100) : 0}%
                  </Text>
                </div>
              </div>
            )}
          </Card>

          {/* Currently Assigned Participants */}
          {host.assigned_participants.length > 0 && (
            <Card className="p-6">
              <Heading className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Currently Assigned Participants
              </Heading>
              <Text className="text-gray-600 dark:text-gray-400 mb-4">
                These participants are already assigned to this host.
              </Text>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {host.assigned_participants.map((participant) => (
                  <div key={participant.id} className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <Text className="font-medium text-gray-900 dark:text-gray-100">
                          {participant.name}
                        </Text>
                        <Text className="text-sm text-gray-600 dark:text-gray-400">
                          📞 {participant.phone_number}
                        </Text>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200">
                          {participant.gender === 'M' ? 'Male' : 'Female'}
                        </span>
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200">
                          Assigned
                        </span>
                        <Tooltip label="Remove Assignment">
                          <Button
                            variant="icon"
                            size="sm"
                            onClick={() => handleDeleteParticipant(participant)}
                            className="w-6 h-6 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20"
                          >
                            <Icon name="trash" width={12} height={12} />
                          </Button>
                        </Tooltip>
                      </div>
                    </div>
                    
                    <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                      <div>Age: {participant.age} | City: {participant.city}</div>
                      <div>Assigned: {new Date(participant.assigned_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}</div>
                      {participant.special_requirements && (
                        <div className="text-orange-600 font-medium">⚠️ {participant.special_requirements}</div>
                      )}
                      {participant.assignment_notes && (
                        <div className="text-blue-600 font-medium">📝 {participant.assignment_notes}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Participant Assignment Section */}
          {activeTab === 'assignable' && host.available_capacity > 0 ? (
            <Card className="p-6">
              <Heading className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Assign Participants
              </Heading>
              <Text className="text-gray-600 dark:text-gray-400 mb-4">
                Select from {availableParticipantsCount} available participants to assign to this host. You can assign up to {host.available_capacity} more participants.
                {assignedParticipantsCount > 0 && (
                  <span className="block mt-2 text-sm text-orange-600 dark:text-orange-400">
                    ℹ️ {assignedParticipantsCount} participants are already assigned to other hosts and are not shown here.
                  </span>
                )}
              </Text>
            
            {/* Host Preferences Display */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 mb-6">
              <Text className="text-sm text-gray-600 dark:text-gray-400">
                <span className="font-medium">Host Preferences:</span> 
                Toilet: <span className="font-medium">{host.toilet_facilities}</span> | 
                Gender: <span className="font-medium">{host.gender_preference}</span>
              </Text>
            </div>
            
            {/* Search Bar */}
            <div className="mb-6">
              <div className="flex items-center gap-3">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="Search participants by name, phone, city, toilet preference..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
                  />
                  <Icon 
                    name="search" 
                    width={16} 
                    height={16} 
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  />
                </div>
                {searchTerm && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setSearchTerm('')}
                    className="px-3"
                  >
                    Clear
                  </Button>
                )}
              </div>
              
              {/* Search Results Count */}
              {searchTerm && (
                <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  {Object.keys(filteredVisibleGroups).length + Object.keys(filteredHiddenGroups).length > 0 ? (
                    <span>
                      Showing {Object.keys(filteredVisibleGroups).length + Object.keys(filteredHiddenGroups).length} groups with matching participants
                    </span>
                  ) : (
                    <span className="text-orange-600 dark:text-orange-400">
                      No groups found matching your search
                    </span>
                  )}
                </div>
              )}
            </div>
            
            {/* Available Groups (Groups with at least one compatible participant) */}
            {Object.keys(filteredVisibleGroups).length > 0 && (
              <div className="space-y-6 mb-8">
                <div className="flex items-center gap-2">
                  <Icon name="check" width={20} height={20} className="text-green-600" />
                  <Heading className="text-lg font-semibold text-green-600 dark:text-green-400">
                    Available Groups ({Object.keys(filteredVisibleGroups).length} groups, {totalVisibleParticipants} participants)
                  </Heading>
                </div>
                
                {Object.entries(filteredVisibleGroups).map(([groupId, participants]) => {
                  const selectedCount = getSelectedCountInGroup(participants);
                  const isAllSelected = selectedCount === participants.length;
                  const hasSelection = selectedCount > 0;
                  
                  // Count incompatible within this group
                  const incompatibleInGroup = participants.filter(p => (p as ParticipantWithCompatibility).incompatibilityReason).length;
                  
                  return (
                    <div key={groupId} className="border border-green-200 dark:border-green-800 rounded-lg p-4 bg-green-50 dark:bg-green-900/20">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Heading className="text-md font-medium text-green-800 dark:text-green-200">
                            Group {groupId} ({participants.length} participants)
                          </Heading>
                          {hasSelection && (
                            <span className="text-sm text-green-600">
                              ({selectedCount} selected)
                            </span>
                          )}
                          {incompatibleInGroup > 0 && (
                            <span className="text-xs text-orange-600 bg-orange-100 dark:bg-orange-900/40 px-2 py-1 rounded">
                              {incompatibleInGroup} incompatible
                            </span>
                          )}
                        </div>
                        <Button 
                          variant="secondary" 
                          size="sm" 
                          className="text-green-600 hover:text-green-700"
                          onClick={() => handleGroupAssign(participants)}
                        >
                          {isAllSelected ? 'Deselect All' : 'Select All'}
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {participants.map((participant) => {
                          const participantWithCompat = participant as ParticipantWithCompatibility;
                          const isCompatible = !participantWithCompat.incompatibilityReason;
                          const incompatibilityReason = participantWithCompat.incompatibilityReason;
                          
                          return (
                            <div key={participant.id} className={`bg-white dark:bg-gray-800 rounded-lg p-3 border ${
                              isCompatible 
                                ? 'border-green-200 dark:border-green-700' 
                                : 'border-orange-200 dark:border-orange-700'
                            }`}>
                                <div className="flex items-start justify-between mb-2">
                                  <div className="flex-1">
                                    <Text className="font-medium text-gray-900 dark:text-gray-100">
                                      {participant.name}
                                    </Text>
                                    <Text className="text-sm text-gray-600 dark:text-gray-400">
                                      📞 {participant.phone_number}
                                    </Text>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                      participant.status === 'registered' 
                                        ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200'
                                        : 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200'
                                    }`}>
                                      {participant.status}
                                    </span>
                                    <input 
                                      type="checkbox" 
                                      checked={selectedParticipants[participant.id] || false}
                                      onChange={(e) => handleParticipantSelect(participant.id, e.target.checked)}
                                      className={`w-4 h-4 border-gray-300 rounded focus:ring-2 ${
                                        isCompatible 
                                          ? 'text-green-600 focus:ring-green-500' 
                                          : 'text-orange-600 focus:ring-orange-500'
                                      }`}
                                    />
                                  </div>
                                </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                                <div>Age: {participant.age} | Gender: {participant.gender}</div>
                                <div>Toilet: {participant.toilet_preference}</div>
                                {incompatibilityReason && (
                                  <div className="text-orange-600 font-medium">⚠️ {incompatibilityReason}</div>
                                )}
                                {participant.special_requirements && (
                                  <div className="text-orange-600">⚠️ {participant.special_requirements}</div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Divider */}
            {Object.keys(filteredHiddenGroups).length > 0 && (
              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300 dark:border-gray-600" />
                </div>
                <div className="relative flex justify-center">
                  <div className="bg-white dark:bg-gray-900 px-4 py-2">
                    <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400">
                      <Icon name="x" width={20} height={20} />
                      <Text className="font-medium">
                        Incompatible Groups ({Object.keys(filteredHiddenGroups).length} groups, {totalHiddenParticipants} participants)
                      </Text>
                    </div>
                    <Text className="text-sm text-gray-500 dark:text-gray-400 text-center">
                      These groups have no compatible participants but can still be assigned
                    </Text>
                  </div>
                </div>
              </div>
            )}

            {/* Incompatible Groups (Groups with no compatible participants) */}
            {Object.keys(filteredHiddenGroups).length > 0 && (
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <Icon name="x" width={20} height={20} className="text-orange-600" />
                  <Heading className="text-lg font-semibold text-orange-600 dark:text-orange-400">
                    Incompatible Groups ({Object.keys(filteredHiddenGroups).length} groups, {totalHiddenParticipants} participants)
                  </Heading>
                </div>
                
                {Object.entries(filteredHiddenGroups).map(([groupId, participants]) => {
                  const selectedCount = getSelectedCountInGroup(participants);
                  const isAllSelected = selectedCount === participants.length;
                  const hasSelection = selectedCount > 0;
                  
                  return (
                    <div key={groupId} className="border border-orange-200 dark:border-orange-800 rounded-lg p-4 bg-orange-50 dark:bg-orange-900/20">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Heading className="text-md font-medium text-orange-800 dark:text-orange-200">
                            Group {groupId} ({participants.length} participants)
                          </Heading>
                          {hasSelection && (
                            <span className="text-sm text-orange-600">
                              ({selectedCount} selected)
                            </span>
                          )}
                          <div className="text-xs text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/40 px-2 py-1 rounded">
                            ⚠️ All Incompatible
                          </div>
                        </div>
                        <Button 
                          variant="secondary" 
                          size="sm" 
                          className="text-orange-600 hover:text-orange-700"
                          onClick={() => handleGroupAssign(participants)}
                        >
                          {isAllSelected ? 'Deselect All' : 'Select All'}
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {participants.map((participant) => {
                          const participantWithCompat = participant as ParticipantWithCompatibility;
                          const incompatibilityReason = participantWithCompat.incompatibilityReason || 'Unknown';
                          return (
                            <div key={participant.id} className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-orange-200 dark:border-orange-700">
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex-1">
                                  <Text className="font-medium text-gray-900 dark:text-gray-100">
                                    {participant.name}
                                  </Text>
                                  <Text className="text-sm text-gray-600 dark:text-gray-400">
                                    📞 {participant.phone_number}
                                  </Text>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    participant.status === 'registered' 
                                      ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200'
                                      : 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200'
                                  }`}>
                                    {participant.status}
                                  </span>
                                  <input 
                                    type="checkbox" 
                                    checked={selectedParticipants[participant.id] || false}
                                    onChange={(e) => handleParticipantSelect(participant.id, e.target.checked)}
                                    className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                                  />
                                </div>
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                                <div>Age: {participant.age} | Gender: {participant.gender}</div>
                                <div>Toilet: {participant.toilet_preference}</div>
                                <div className="text-orange-600 font-medium">⚠️ {incompatibilityReason}</div>
                                {participant.special_requirements && (
                                  <div className="text-orange-600">⚠️ {participant.special_requirements}</div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Empty State */}
            {Object.keys(filteredVisibleGroups).length === 0 && Object.keys(filteredHiddenGroups).length === 0 && (
              <div className="text-center py-12">
                <Icon name="user-plus" width={64} height={64} className="text-gray-400 mx-auto mb-4" />
                <Heading className="text-lg text-gray-500 dark:text-gray-400 mb-2">
                  {searchTerm ? 'No Groups Found' : (availableParticipantsCount === 0 ? 'All Participants Assigned' : 'No Participants Available')}
                </Heading>
                <Text className="text-gray-400 dark:text-gray-500">
                  {searchTerm 
                    ? `No groups found matching "${searchTerm}". Try a different search term.`
                    : availableParticipantsCount === 0 
                      ? `All ${totalParticipants} participants are already assigned to hosts.`
                      : 'No participants found for this event day.'
                  }
                </Text>
                {assignedParticipantsCount > 0 && !searchTerm && (
                  <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg max-w-md mx-auto">
                    <Text className="text-blue-600 dark:text-blue-400 text-sm">
                      ℹ️ {assignedParticipantsCount} participants are already assigned to other hosts.
                    </Text>
                  </div>
                )}
              </div>
            )}

            {/* Selection Summary */}
            {Object.keys(filteredVisibleGroups).length > 0 || Object.keys(filteredHiddenGroups).length > 0 ? (
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {Object.values(selectedParticipants).filter(Boolean).length} participants selected
                  </div>
                  <Button 
                    variant="secondary" 
                    size="sm"
                    onClick={() => setSelectedParticipants({})}
                    disabled={Object.values(selectedParticipants).filter(Boolean).length === 0}
                  >
                    Clear Selection
                  </Button>
                </div>
                
                {assignmentError && (
                  <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <Text className="text-red-600 dark:text-red-400 text-sm">
                      {assignmentError}
                    </Text>
                  </div>
                )}
              </div>
            ) : null}
            </Card>
          ) : activeTab === 'assignable' ? (
            <Card className="p-6">
              <div className="text-center py-12">
                <Icon name="check" width={64} height={64} className="text-green-500 mx-auto mb-4" />
                <Heading className="text-lg text-gray-500 dark:text-gray-400 mb-2">
                  Host at Full Capacity
                </Heading>
                <Text className="text-gray-400 dark:text-gray-500">
                  This host has reached maximum capacity ({host.max_participants} participants).
                </Text>
              </div>
            </Card>
          ) : (
            <Card className="p-6">
              <Heading className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Other Participants
              </Heading>
              <Text className="text-gray-600 dark:text-gray-400 mb-4">
                These participants have 'waiting' or 'cancelled' status and cannot be assigned to hosts.
              </Text>
              
              {/* Host Preferences Display */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 mb-6">
                <Text className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Host Preferences:</span> 
                  Toilet: <span className="font-medium">{host.toilet_facilities}</span> | 
                  Gender: <span className="font-medium">{host.gender_preference}</span>
                </Text>
              </div>
              
              {/* Search Bar */}
              <div className="mb-6">
                <div className="flex items-center gap-3">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      placeholder="Search participants by name, phone, city, toilet preference..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full px-4 py-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
                    />
                    <Icon 
                      name="search" 
                      width={16} 
                      height={16} 
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    />
                  </div>
                  {searchTerm && (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setSearchTerm('')}
                      className="px-3"
                    >
                      Clear
                    </Button>
                  )}
                </div>
                
                {/* Search Results Count */}
                {searchTerm && (
                  <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    {Object.keys(filteredVisibleGroups).length + Object.keys(filteredHiddenGroups).length > 0 ? (
                      <span>
                        Showing {Object.keys(filteredVisibleGroups).length + Object.keys(filteredHiddenGroups).length} groups with matching participants
                      </span>
                    ) : (
                      <span className="text-orange-600 dark:text-orange-400">
                        No groups found matching your search
                      </span>
                    )}
                  </div>
                )}
              </div>
              
              {/* Available Groups (Groups with at least one compatible participant) */}
              {Object.keys(filteredVisibleGroups).length > 0 && (
                <div className="space-y-6 mb-8">
                  <div className="flex items-center gap-2">
                    <Icon name="check" width={20} height={20} className="text-green-600" />
                    <Heading className="text-lg font-semibold text-green-600 dark:text-green-400">
                      Available Groups ({Object.keys(filteredVisibleGroups).length} groups, {totalVisibleParticipants} participants)
                    </Heading>
                  </div>
                  
                  {Object.entries(filteredVisibleGroups).map(([groupId, participants]) => {
                    const selectedCount = getSelectedCountInGroup(participants);
                    const isAllSelected = selectedCount === participants.length;
                    const hasSelection = selectedCount > 0;
                    
                    // Count incompatible within this group
                    const incompatibleInGroup = participants.filter(p => (p as ParticipantWithCompatibility).incompatibilityReason).length;
                    
                    return (
                      <div key={groupId} className="border border-green-200 dark:border-green-800 rounded-lg p-4 bg-green-50 dark:bg-green-900/20">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <Heading className="text-md font-medium text-green-800 dark:text-green-200">
                              Group {groupId} ({participants.length} participants)
                            </Heading>
                            {hasSelection && (
                              <span className="text-sm text-green-600">
                                ({selectedCount} selected)
                              </span>
                            )}
                            {incompatibleInGroup > 0 && (
                              <span className="text-xs text-orange-600 bg-orange-100 dark:bg-orange-900/40 px-2 py-1 rounded">
                                {incompatibleInGroup} incompatible
                              </span>
                            )}
                          </div>
                          <Button 
                            variant="secondary" 
                            size="sm" 
                            className="text-green-600 hover:text-green-700"
                            onClick={() => handleGroupAssign(participants)}
                          >
                            {isAllSelected ? 'Deselect All' : 'Select All'}
                          </Button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                          {participants.map((participant) => {
                            const participantWithCompat = participant as ParticipantWithCompatibility;
                            const isCompatible = !participantWithCompat.incompatibilityReason;
                            const incompatibilityReason = participantWithCompat.incompatibilityReason;
                            
                            return (
                              <div key={participant.id} className={`bg-white dark:bg-gray-800 rounded-lg p-3 border ${
                                isCompatible 
                                  ? 'border-green-200 dark:border-green-700' 
                                  : 'border-orange-200 dark:border-orange-700'
                              }`}>
                                <div className="flex items-start justify-between mb-2">
                                  <div className="flex-1">
                                    <Text className="font-medium text-gray-900 dark:text-gray-100">
                                      {participant.name}
                                    </Text>
                                    <Text className="text-sm text-gray-600 dark:text-gray-400">
                                      📞 {participant.phone_number}
                                    </Text>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                      participant.status === 'waiting' 
                                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-200'
                                        : 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200'
                                    }`}>
                                      {participant.status}
                                    </span>
                                  </div>
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                                  <div>Age: {participant.age} | Gender: {participant.gender}</div>
                                  <div>Toilet: {participant.toilet_preference}</div>
                                  {incompatibilityReason && (
                                    <div className="text-orange-600 font-medium">⚠️ {incompatibilityReason}</div>
                                  )}
                                  {participant.special_requirements && (
                                    <div className="text-orange-600">⚠️ {participant.special_requirements}</div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Divider */}
              {Object.keys(filteredHiddenGroups).length > 0 && (
                <div className="relative my-8">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300 dark:border-gray-600" />
                  </div>
                  <div className="relative flex justify-center">
                    <div className="bg-white dark:bg-gray-900 px-4 py-2">
                      <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400">
                        <Icon name="x" width={20} height={20} />
                        <Text className="font-medium">
                          Incompatible Groups ({Object.keys(filteredHiddenGroups).length} groups, {totalHiddenParticipants} participants)
                        </Text>
                      </div>
                      <Text className="text-sm text-gray-500 dark:text-gray-400 text-center">
                        These groups have no compatible participants
                      </Text>
                    </div>
                  </div>
                </div>
              )}

              {/* Incompatible Groups (Groups with no compatible participants) */}
              {Object.keys(filteredHiddenGroups).length > 0 && (
                <div className="space-y-6">
                  <div className="flex items-center gap-2">
                    <Icon name="x" width={20} height={20} className="text-orange-600" />
                    <Heading className="text-lg font-semibold text-orange-600 dark:text-orange-400">
                      Incompatible Groups ({Object.keys(filteredHiddenGroups).length} groups, {totalHiddenParticipants} participants)
                    </Heading>
                  </div>
                  
                  {Object.entries(filteredHiddenGroups).map(([groupId, participants]) => {
                    const selectedCount = getSelectedCountInGroup(participants);
                    const isAllSelected = selectedCount === participants.length;
                    const hasSelection = selectedCount > 0;
                    
                    return (
                      <div key={groupId} className="border border-orange-200 dark:border-orange-800 rounded-lg p-4 bg-orange-50 dark:bg-orange-900/20">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <Heading className="text-md font-medium text-orange-800 dark:text-orange-200">
                              Group {groupId} ({participants.length} participants)
                            </Heading>
                            {hasSelection && (
                              <span className="text-sm text-orange-600">
                                ({selectedCount} selected)
                              </span>
                            )}
                            <div className="text-xs text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/40 px-2 py-1 rounded">
                              ⚠️ All Incompatible
                            </div>
                          </div>
                          <Button 
                            variant="secondary" 
                            size="sm" 
                            className="text-orange-600 hover:text-orange-700"
                            onClick={() => handleGroupAssign(participants)}
                          >
                            {isAllSelected ? 'Deselect All' : 'Select All'}
                          </Button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                          {participants.map((participant) => {
                            const participantWithCompat = participant as ParticipantWithCompatibility;
                            const incompatibilityReason = participantWithCompat.incompatibilityReason || 'Unknown';
                            return (
                              <div key={participant.id} className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-orange-200 dark:border-orange-700">
                                <div className="flex items-start justify-between mb-2">
                                  <div className="flex-1">
                                    <Text className="font-medium text-gray-900 dark:text-gray-100">
                                      {participant.name}
                                    </Text>
                                    <Text className="text-sm text-gray-600 dark:text-gray-400">
                                      📞 {participant.phone_number}
                                    </Text>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                      participant.status === 'waiting' 
                                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-200'
                                        : 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200'
                                    }`}>
                                      {participant.status}
                                    </span>
                                  </div>
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                                  <div>Age: {participant.age} | Gender: {participant.gender}</div>
                                  <div>Toilet: {participant.toilet_preference}</div>
                                  <div className="text-orange-600 font-medium">⚠️ {incompatibilityReason}</div>
                                  {participant.special_requirements && (
                                    <div className="text-orange-600">⚠️ {participant.special_requirements}</div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Empty State */}
              {Object.keys(filteredVisibleGroups).length === 0 && Object.keys(filteredHiddenGroups).length === 0 && (
                <div className="text-center py-12">
                  <Icon name="user-plus" width={64} height={64} className="text-gray-400 mx-auto mb-4" />
                  <Heading className="text-lg text-gray-500 dark:text-gray-400 mb-2">
                    {searchTerm ? 'No Groups Found' : 'No Other Participants Available'}
                  </Heading>
                  <Text className="text-gray-400 dark:text-gray-500">
                    {searchTerm 
                      ? `No groups found matching "${searchTerm}". Try a different search term.`
                      : 'No participants with waiting or cancelled status found for this event day.'
                    }
                  </Text>
                </div>
              )}

              {/* Information Banner */}
              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <Text className="text-blue-600 dark:text-blue-400 text-sm">
                  💡 These participants have 'waiting' or 'cancelled' status and cannot be assigned to hosts. 
                  To assign participants, they must have 'registered' or 'confirmed' status. 
                  Switch to the "Assignable Participants" tab to view and assign eligible participants.
                </Text>
              </div>
            </Card>
          )}
        </div>
      </main>

      {/* Floating Assignment Button */}
      {activeTab === 'assignable' && host.available_capacity > 0 && (Object.keys(filteredVisibleGroups).length > 0 || Object.keys(filteredHiddenGroups).length > 0) && Object.values(selectedParticipants).filter(Boolean).length > 0 && (
        <div className="fixed bottom-6 right-6 z-40">
          <div className="flex flex-col items-end gap-3">
            {/* Selection Count Badge */}
            {Object.values(selectedParticipants).filter(Boolean).length > 0 && (
              <div className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
                {Object.values(selectedParticipants).filter(Boolean).length} selected
              </div>
            )}
            
            {/* Floating Assign Button */}
            <Button 
              variant="primary" 
              size="lg"
              onClick={handleAssignParticipants}
              disabled={isAssigning}
              className="shadow-lg hover:shadow-xl transition-all duration-200 rounded-full px-6 py-3 min-w-[200px]"
            >
              <div className="flex items-center space-x-2">
                {isAssigning ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <Text>Assigning...</Text>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M8.5 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM20 8v6M23 11h-6" />
                    </svg>
                    <Text>Assign Selected</Text>
                  </>
                )}
              </div>
            </Button>
          </div>
        </div>
      )}

      {/* Assignment Confirmation Dialog */}
      {showConfirmationDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <Icon name="alert-triangle" width={24} height={24} className="text-orange-500" />
              <Heading className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Confirm Assignment
              </Heading>
            </div>
            
            <Text className="text-gray-600 dark:text-gray-400 mb-4">
              You are about to assign {Object.values(selectedParticipants).filter(Boolean).length} participants to{' '}
              <span className="font-medium">{host?.name}</span>. This action cannot be undone.
            </Text>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Assignment Notes (Optional)
              </label>
              <textarea
                value={assignmentNotes}
                onChange={(e) => setAssignmentNotes(e.target.value)}
                placeholder="Add any notes about this assignment..."
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
                rows={3}
              />
            </div>
            
            <div className="flex gap-3 justify-end">
              <Button 
                variant="secondary" 
                onClick={handleCancelAssignment}
                disabled={isAssigning}
              >
                Cancel
              </Button>
              <Button 
                variant="primary" 
                onClick={handleConfirmAssignment}
                disabled={isAssigning}
              >
                {isAssigning ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Assigning...
                  </>
                ) : (
                  'Confirm Assignment'
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Assignment Dialog */}
      <DeleteAssignmentDialog
        isOpen={deleteDialogOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        participantName={participantToDelete?.name || ''}
        hostName={host?.name || ''}
        isLoading={isDeleting}
      />
    </div>
  );
}
