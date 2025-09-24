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
import type { MemberStatus } from '../services/endpoints/registration.types';

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

  // Get the active event ID from the events state
  const { activeEvent } = useAppSelector((state) => state.events);

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
    // TODO: Implement API call to add participant to the selected day
    console.log('Adding complete registration:', registrationData);
    console.log('To day:', selectedDay);
    
    // For now, just close the modal
    // In a real implementation, you would:
    // 1. Call an API to add the participant with all registration data
    // 2. Refresh the dashboard data
    // 3. Update the local state
    setIsAddParticipantModalOpen(false);
  };

  const handleStatusUpdate = async (participantId: string, status: MemberStatus) => {
    try {
      // Call the API to update participant status
      const updatedParticipant = await registrationService.updateParticipantStatus(participantId, { status });
      
      // Update Redux state with the complete updated participant data
      dispatch(updateParticipantStatus({ 
        participantId, 
        updatedParticipant: updatedParticipant as any // Type assertion needed due to slight type differences
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
        onClose={() => setIsAddParticipantModalOpen(false)}
        onSubmit={handleAddParticipantSubmit}
      />
    </div>
  );
}
