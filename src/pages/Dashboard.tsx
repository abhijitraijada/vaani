import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import { fetchEventDashboard } from '../store/dashboardSlice';
import { Card } from '../components/primitives/Layout';
import { Heading, Text } from '../components/primitives/Typography';
import { Sidebar } from '../components/navigation/Sidebar';
import { DashboardHeader } from '../components/navigation/DashboardHeader';
import { SummaryCard } from '../components/dashboard/SummaryCard';
import { DetailedSummary } from '../components/dashboard/DetailedSummary';

export default function Dashboard() {
  const dispatch = useAppDispatch();
  const { 
    eventData, 
    isLoading, 
    error
  } = useAppSelector((state) => state.dashboard);

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


  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Sidebar />
        <DashboardHeader pageName="Dashboard" />
        <div className="ml-64 flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <Text>Loading dashboard...</Text>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen">
        <Sidebar />
        <DashboardHeader pageName="Dashboard" />
        <div className="ml-64 flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <Heading className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Failed to Load Dashboard
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
        <DashboardHeader pageName="Dashboard" />
        <div className="ml-64 flex items-center justify-center h-64">
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
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Sidebar />
      <DashboardHeader pageName="Dashboard" />
      
      <main className="ml-64 overflow-y-auto">
        <div className="p-6 space-y-6">
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

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Participants by Day Chart */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <Heading className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Participants by Day
                </Heading>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <Text className="text-sm text-gray-600 dark:text-gray-400">Total</Text>
                </div>
              </div>
              
              {/* Simple Bar Chart */}
              <div className="space-y-4">
                {eventData.daily_schedule.map((day) => {
                  const maxParticipants = Math.max(...eventData.daily_schedule.map(d => d.participants.length));
                  const barHeight = (day.participants.length / maxParticipants) * 200;
                  
                  return (
                    <div key={day.event_day_id} className="flex items-end space-x-2">
                      <div className="w-16 text-xs text-gray-600 dark:text-gray-400 text-right">
                        {new Date(day.event_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </div>
                      <div className="flex-1 flex items-end space-x-1">
                        <div 
                          className="bg-purple-500 rounded-t"
                          style={{ height: `${barHeight}px`, minHeight: '20px' }}
                        ></div>
                      </div>
                      <div className="w-12 text-xs text-gray-600 dark:text-gray-400 text-left">
                        {day.participants.length}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Registration Status Chart */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <Heading className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Registration Status
                </Heading>
              </div>
              
              {/* Donut Chart */}
              <div className="flex items-center justify-center">
                <div className="relative w-48 h-48">
                  <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 100 100">
                    {/* Background circle */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#e5e7eb"
                      strokeWidth="8"
                    />
                    
                    {/* Confirmed segment */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="8"
                      strokeDasharray={`${(eventData.confirmed_participants / eventData.total_participants) * 251.2} 251.2`}
                      strokeDashoffset="0"
                    />
                    
                    {/* Waiting segment */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth="8"
                      strokeDasharray={`${(eventData.waiting_participants / eventData.total_participants) * 251.2} 251.2`}
                      strokeDashoffset={`-${(eventData.confirmed_participants / eventData.total_participants) * 251.2}`}
                    />
                  </svg>
                  
                  {/* Center text */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <Text className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        {eventData.total_participants}
                      </Text>
                      <Text className="text-sm text-gray-600 dark:text-gray-400">Total</Text>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Legend */}
              <div className="mt-6 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <Text className="text-sm text-gray-600 dark:text-gray-400">Confirmed</Text>
                  </div>
                  <Text className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {Math.round((eventData.confirmed_participants / eventData.total_participants) * 100)}%
                  </Text>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <Text className="text-sm text-gray-600 dark:text-gray-400">Waiting</Text>
                  </div>
                  <Text className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {Math.round((eventData.waiting_participants / eventData.total_participants) * 100)}%
                  </Text>
                </div>
              </div>
            </Card>
          </div>

          {/* Event Summary */}
          <Card className="p-6">
            <Heading className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Event Summary
            </Heading>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <Text className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {eventData.summary.total_groups}
                </Text>
                <Text className="text-sm text-gray-600 dark:text-gray-400">Total Groups</Text>
              </div>
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <Text className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {eventData.summary.group_registrations}
                </Text>
                <Text className="text-sm text-gray-600 dark:text-gray-400">Group Registrations</Text>
              </div>
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <Text className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {eventData.daily_schedule.length}
                </Text>
                <Text className="text-sm text-gray-600 dark:text-gray-400">Event Days</Text>
              </div>
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <Text className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {new Date(eventData.event_start_date).toLocaleDateString('en-US', { month: 'short' })} - {new Date(eventData.event_end_date).toLocaleDateString('en-US', { month: 'short' })}
                </Text>
                <Text className="text-sm text-gray-600 dark:text-gray-400">Duration</Text>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
