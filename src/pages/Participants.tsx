import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import { fetchEventDashboard, setSelectedDay, updatePaginatedData, updateParticipantStatus } from '../store/dashboardSlice';
import { Sidebar } from '../components/navigation/Sidebar';
import { DashboardHeader } from '../components/navigation/DashboardHeader';
import { ParticipantsTable } from '../components/dashboard/ParticipantsTable';
import { DateTabs } from '../components/dashboard/DateTabs';
import { Card } from '../components/primitives/Layout';
import { Heading, Text } from '../components/primitives/Typography';
import { ExcelExportService } from '../services/export/ExcelExportService';
import { AddParticipantModal } from '../components/dashboard/AddParticipantModal';
import { registrationService } from '../services/endpoints/registration.service';
import type { ExportOptions } from '../services/export/export.types';
import type { CompleteRegistrationData } from '../components/dashboard/AddParticipantModal';
import type { MemberStatus, RegistrationRequest } from '../services/endpoints/registration.types';

export default function Participants() {
  const dispatch = useAppDispatch();
  const { 
    eventData, 
    selectedDay, 
    isLoading, 
    error, 
    paginatedData 
  } = useAppSelector((state) => state.dashboard);

  const pageSize = 50; // Fixed page size
  const [isAddParticipantModalOpen, setIsAddParticipantModalOpen] = useState(false);
  const [addParticipantError, setAddParticipantError] = useState<string | null>(null);

  // Get the active event ID from the events state
  const { activeEvent } = useAppSelector((state) => state.events);

  // Helper function to map date string to event_day_id
  const getEventDayIdByDate = (dateString: string): string | null => {
    if (!eventData) return null;
    
    const eventDay = eventData.daily_schedule.find(day => 
      day.event_date === dateString
    );
    
    return eventDay?.event_day_id || null;
  };

  // Transform modal data to API format
  const transformToRegistrationRequest = (
    registrationData: CompleteRegistrationData
  ): RegistrationRequest | null => {
    if (!activeEvent?.id) {
      console.error('No active event found');
      return null;
    }

    // Transform members
    const members = registrationData.participants.map(participant => ({
      name: participant.name,
      phone_number: participant.phone,
      email: participant.email || undefined,
      city: participant.city || undefined,
      age: participant.age || undefined,
      gender: participant.gender,
      language: participant.language || undefined,
      special_requirements: participant.special_requirements || undefined,
      status: 'registered' as MemberStatus
    }));

    // Transform daily preferences - only for days where attending is true
    const daily_preferences = Object.entries(registrationData.preferencesByDate)
      .filter(([, prefs]) => prefs.attending !== false) // Include if attending or undefined
      .map(([date, prefs]) => {
        const event_day_id = getEventDayIdByDate(date);
        if (!event_day_id) {
          console.warn(`Could not find event_day_id for date: ${date}`);
          return null;
        }
        
        return {
          event_day_id,
          staying_with_yatra: prefs.stayingWithYatra,
          dinner_at_host: prefs.dinnerAtHost,
          breakfast_at_host: prefs.breakfastAtHost,
          lunch_with_yatra: prefs.lunchWithYatra,
          physical_limitations: prefs.physicalLimitations || undefined,
          toilet_preference: prefs.toiletPreference || 'indian'
        };
      })
      .filter((pref): pref is NonNullable<typeof pref> => pref !== null);

    // Build registration request
    const request: RegistrationRequest = {
      event_id: activeEvent.id,
      registration_type: registrationData.participants.length === 1 ? 'individual' : 'group',
      number_of_members: registrationData.participants.length,
      transportation_mode: registrationData.transportType || 'public', // Default to 'public' if null
      has_empty_seats: registrationData.vehicle.hasEmptySeats,
      available_seats_count: registrationData.vehicle.availableSeats,
      notes: '', // Could be added to modal if needed
      members,
      daily_preferences
    };

    return request;
  };

  useEffect(() => {
    if (activeEvent?.id && !eventData) {
      dispatch(fetchEventDashboard(activeEvent.id));
    }
  }, [dispatch, activeEvent?.id, eventData]);

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

  const handleDaySelect = (dayId: string) => {
    dispatch(setSelectedDay(dayId));
  };

  const handlePageChange = (page: number) => {
    if (!selectedDay || !eventData) return;
    
    const selectedDayData = eventData.daily_schedule.find(day => day.event_day_id === selectedDay);
    if (!selectedDayData) return;

    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedParticipants = selectedDayData.participants.slice(startIndex, endIndex);
    const totalPages = Math.ceil(selectedDayData.participants.length / pageSize);

    dispatch(updatePaginatedData({
      dayId: selectedDay,
      data: {
        participants: paginatedParticipants,
        totalPages,
        currentPage: page,
        totalCount: selectedDayData.participants.length,
      }
    }));
  };

  const handleAddParticipant = () => {
    setIsAddParticipantModalOpen(true);
  };

  const handleAddParticipantSubmit = async (registrationData: CompleteRegistrationData) => {
    try {
      // Clear any previous errors
      setAddParticipantError(null);
      
      // Transform modal data to API format
      const apiRequest = transformToRegistrationRequest(registrationData);
      
      if (!apiRequest) {
        throw new Error('Failed to prepare registration data');
      }
      
      // Validate that we have at least one daily preference
      if (apiRequest.daily_preferences.length === 0) {
        throw new Error('Please select at least one day to attend');
      }
      
      // Call API to create registration
      console.log('Creating registration:', apiRequest);
      const response = await registrationService.register(apiRequest);
      console.log('Registration created successfully:', response);
      
      // Refresh dashboard data to show new participant
      if (activeEvent?.id) {
        await dispatch(fetchEventDashboard(activeEvent.id));
      }
      
      // Close modal
      setIsAddParticipantModalOpen(false);
      
      // Show success message (optional - could use toast notification)
      console.log('Participant added successfully!');
      
    } catch (error: unknown) {
      console.error('Failed to add participant:', error);
      
      // Set error message for user feedback
      const errorMessage = (error as any)?.response?.data?.detail 
        || (error as Error)?.message 
        || 'Failed to add participant. Please try again.';
      
      setAddParticipantError(errorMessage);
      
      // Don't close modal on error - let user see the error and retry
    }
  };

  const handleStatusUpdate = async (participantId: string, status: MemberStatus) => {
    try {
      // Call the API to update participant status
      const updatedParticipant = await registrationService.updateParticipantStatus(participantId, { status });
      
      // Update Redux state with the complete updated participant data
      // Note: StatusUpdateResponse has fewer fields than Participant, but the essential ones are present
      dispatch(updateParticipantStatus({ 
        participantId, 
        updatedParticipant: updatedParticipant as any // Type assertion needed due to field differences
      }));
    } catch (error) {
      console.error('Failed to update participant status:', error);
      throw error; // Re-throw to let the component handle the error
    }
  };

  const handleExport = async (options: ExportOptions) => {
    if (!eventData) return;

    const exportService = ExcelExportService.getInstance();
    
    await exportService.generateExcelFile(
      eventData,
      options,
      (progress, step) => {
        // You can dispatch progress updates to Redux here if needed
        console.log(`Export progress: ${progress}% - ${step}`);
      }
    );
  };

  // Prepare available days for export
  const availableDays = eventData?.daily_schedule.map(day => ({
    id: day.event_day_id,
    date: day.event_date,
    location: day.location_name,
    participants: day.participants,
  })) || [];

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Sidebar />
        <DashboardHeader pageName="Participants" />
        <div className="ml-64 flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <Text>Loading participants...</Text>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen">
        <Sidebar />
        <DashboardHeader pageName="Participants" />
        <div className="ml-64 flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <Heading className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Failed to Load Participants
            </Heading>
            <Text className="text-gray-600 dark:text-gray-400 mb-4">{error}</Text>
          </div>
        </div>
      </div>
    );
  }

  if (!eventData) {
    return (
      <div className="min-h-screen">
        <Sidebar />
        <DashboardHeader pageName="Participants" />
        <div className="ml-64 flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-gray-400 text-6xl mb-4">👥</div>
            <Heading className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              No Participants Data
            </Heading>
            <Text className="text-gray-600 dark:text-gray-400">
              No event data available for participants.
            </Text>
          </div>
        </div>
      </div>
    );
  }

  const selectedDayData = eventData.daily_schedule.find(day => day.event_day_id === selectedDay);
  const currentPaginatedData = selectedDay ? paginatedData[selectedDay] : null;

  return (
    <div className="min-h-screen">
      <Sidebar />
      <DashboardHeader pageName="Participants" />
      
      <main className="ml-64 overflow-y-auto">
        <div className="p-6 space-y-6">

          {/* Date Tabs */}
          <Card className="p-6">
            <Heading className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Select Event Day
            </Heading>
            <DateTabs
              days={eventData.daily_schedule}
              selectedDayId={selectedDay}
              onDaySelect={handleDaySelect}
            />
          </Card>

          {/* Selected Day Content */}
          {selectedDayData && currentPaginatedData && (
            <div className="space-y-6">
              {/* Day Info Card */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <Heading className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                      {new Date(selectedDayData.event_date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </Heading>
                    <Text className="text-gray-600 dark:text-gray-400">
                      {selectedDayData.location_name}
                    </Text>
                  </div>
                  <div className="text-right">
                    <Text className="text-sm text-gray-500 dark:text-gray-400">
                      {selectedDayData.participants.length} participants
                    </Text>
                  </div>
                </div>
                
                {selectedDayData.daily_notes && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-4">
                    <Text className="text-sm text-blue-800 dark:text-blue-200">
                      <strong>Notes:</strong> {selectedDayData.daily_notes}
                    </Text>
                  </div>
                )}

                {/* Meal Information */}
                <div className="flex gap-4">
                  <div className={`px-3 py-1 rounded-full text-sm ${selectedDayData.breakfast_provided ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'}`}>
                    🍳 Breakfast {selectedDayData.breakfast_provided ? 'Provided' : 'Not Provided'}
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm ${selectedDayData.lunch_provided ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'}`}>
                    🍽️ Lunch {selectedDayData.lunch_provided ? 'Provided' : 'Not Provided'}
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm ${selectedDayData.dinner_provided ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'}`}>
                    🍴 Dinner {selectedDayData.dinner_provided ? 'Provided' : 'Not Provided'}
                  </div>
                </div>
              </Card>

              {/* Participants Table */}
              <ParticipantsTable
                participants={selectedDayData.participants}
                onPageChange={handlePageChange}
                onExport={handleExport}
                onAddParticipant={handleAddParticipant}
                onStatusUpdate={handleStatusUpdate}
                availableDays={availableDays}
              />
            </div>
          )}

          {/* No Day Selected State */}
          {!selectedDay && (
            <Card className="p-12 text-center">
              <div className="text-gray-400 text-6xl mb-4">📅</div>
              <Heading className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Select a Day
              </Heading>
              <Text className="text-gray-600 dark:text-gray-400">
                Choose an event day from the tabs above to view participants.
              </Text>
            </Card>
          )}
        </div>
      </main>

      {/* Add Participant Modal */}
      <AddParticipantModal
        isOpen={isAddParticipantModalOpen}
        onClose={() => {
          setIsAddParticipantModalOpen(false);
          setAddParticipantError(null);
        }}
        onSubmit={handleAddParticipantSubmit}
      />

      {/* Error Display */}
      {addParticipantError && isAddParticipantModalOpen && (
        <div className="fixed bottom-4 right-4 z-[60] max-w-md">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 shadow-lg">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3 flex-1">
                <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                  Error Adding Participant
                </h3>
                <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                  {addParticipantError}
                </div>
              </div>
              <button
                onClick={() => setAddParticipantError(null)}
                className="ml-3 flex-shrink-0 text-red-400 hover:text-red-600"
              >
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
