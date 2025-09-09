import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import { fetchEventDashboard, setSelectedDay, updatePaginatedData } from '../store/dashboardSlice';
import { Container, Section, Card } from '../components/primitives/Layout';
import { Heading, Text } from '../components/primitives/Typography';
import { Button } from '../components/primitives/Button';
import { Header } from '../components/navigation/AppShell';
import { SummaryCard } from '../components/dashboard/SummaryCard';
import { DateTabs } from '../components/dashboard/DateTabs';
import { ParticipantsTable } from '../components/dashboard/ParticipantsTable';
import { DetailedSummary } from '../components/dashboard/DetailedSummary';
import { ExcelExportService } from '../services/export/ExcelExportService';
import { useNavigate } from 'react-router-dom';
import type { ExportOptions } from '../services/export/export.types';

export default function Dashboard() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { 
    eventData, 
    selectedDay, 
    isLoading, 
    error, 
    paginatedData 
  } = useAppSelector((state) => state.dashboard);

  const pageSize = 50; // Fixed page size

  // Get the active event ID from the events state
  const { activeEvent } = useAppSelector((state) => state.events);

  useEffect(() => {
    if (activeEvent?.id) {
      dispatch(fetchEventDashboard(activeEvent.id));
    }
  }, [dispatch, activeEvent?.id]);

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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <Text>Loading dashboard...</Text>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <Heading className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Failed to Load Dashboard
          </Heading>
          <Text className="text-gray-600 dark:text-gray-400 mb-4">{error}</Text>
          <Button onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (!eventData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 text-6xl mb-4">📊</div>
          <Heading className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            No Dashboard Data
          </Heading>
          <Text className="text-gray-600 dark:text-gray-400">
            No event data available for dashboard.
          </Text>
        </div>
      </div>
    );
  }

  const selectedDayData = eventData.daily_schedule.find(day => day.event_day_id === selectedDay);
  const currentPaginatedData = selectedDay ? paginatedData[selectedDay] : null;

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        left={<Text className="font-semibold tracking-tight text-4xl">Dashboard</Text>}
        right={<Button variant="secondary" onClick={() => navigate('/')}>Home</Button>}
      />

      <main className="flex-1">
        <Section>
          <Container>
            {/* Event Header */}
            <div className="mb-8">
              <Heading className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                {eventData.event_name}
              </Heading>
              <Text className="text-gray-600 dark:text-gray-400">
                {new Date(eventData.event_start_date).toLocaleDateString()} - {new Date(eventData.event_end_date).toLocaleDateString()}
              </Text>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <SummaryCard
                title="Total Participants"
                value={eventData.total_participants}
                subtitle="Across all days"
                icon="👥"
              />
              <SummaryCard
                title="Confirmed"
                value={eventData.confirmed_participants}
                subtitle={`${Math.round((eventData.confirmed_participants / eventData.total_participants) * 100)}% of total`}
                icon="✅"
              />
              <SummaryCard
                title="Waiting"
                value={eventData.waiting_participants}
                subtitle="Pending confirmation"
                icon="⏳"
              />
              <SummaryCard
                title="Total Groups"
                value={eventData.summary.total_groups}
                subtitle={`${eventData.summary.group_registrations} group registrations`}
                icon="👨‍👩‍👧‍👦"
              />
            </div>

            {/* Detailed Summary */}
            <div className="mb-8">
              <DetailedSummary summary={eventData.summary} />
            </div>

            {/* Date Tabs */}
            <div className="mb-8">
              <DateTabs
                days={eventData.daily_schedule}
                selectedDayId={selectedDay}
                onDaySelect={handleDaySelect}
              />
            </div>

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
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                      <Text className="text-sm text-blue-800 dark:text-blue-200">
                        <strong>Notes:</strong> {selectedDayData.daily_notes}
                      </Text>
                    </div>
                  )}

                  {/* Meal Information */}
                  <div className="flex gap-4 mt-4">
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
                  availableDays={availableDays}
                />
              </div>
            )}
          </Container>
        </Section>
      </main>
    </div>
  );
}
