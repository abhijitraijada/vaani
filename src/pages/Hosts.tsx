import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import { fetchHostsDashboard, setSelectedDay, updatePaginatedData } from '../store/hostSlice';
import { Sidebar } from '../components/navigation/Sidebar';
import { DashboardHeader } from '../components/navigation/DashboardHeader';
import { Card } from '../components/primitives/Layout';
import { Heading, Text } from '../components/primitives/Typography';
import { Button } from '../components/primitives/Button';
import { AddHostModal } from '../components/dashboard/AddHostModal';
import { HostsTable } from '../components/dashboard/HostsTable';
import { HostBulkUpload } from '../components/dashboard/HostBulkUpload';
import { DateTabs } from '../components/dashboard/DateTabs';
import { hostService } from '../services/endpoints/host.service';
import type { CreateHostRequest, HostWithAssignments } from '../services/endpoints/host.types';
import { useNavigate } from 'react-router-dom';

export default function Hosts() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { 
    hostsData, 
    selectedDay, 
    isLoading, 
    error, 
    paginatedData 
  } = useAppSelector((state) => state.hosts);

  const pageSize = 50; // Fixed page size
  const [isAddHostModalOpen, setIsAddHostModalOpen] = useState(false);
  const [isEditHostModalOpen, setIsEditHostModalOpen] = useState(false);
  const [editingHost, setEditingHost] = useState<HostWithAssignments | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Get the active event ID from the events state
  const { activeEvent } = useAppSelector((state) => state.events);

  useEffect(() => {
    if (activeEvent?.id) {
      dispatch(fetchHostsDashboard(activeEvent.id));
    }
  }, [dispatch, activeEvent?.id]);

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
    if (!selectedDay || !hostsData) return;
    
    const selectedDayData = hostsData.daily_schedule.find(day => day.event_day_id === selectedDay);
    if (!selectedDayData) return;

    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedHosts = selectedDayData.hosts.slice(startIndex, endIndex);
    const totalPages = Math.ceil(selectedDayData.hosts.length / pageSize);

    dispatch(updatePaginatedData({
      dayId: selectedDay,
      data: {
        hosts: paginatedHosts,
        totalPages,
        currentPage: page,
        totalCount: selectedDayData.hosts.length,
      }
    }));
  };

  const handleAddHost = () => {
    setIsAddHostModalOpen(true);
  };

  const handleAddHostSubmit = async (hostData: CreateHostRequest) => {
    try {
      // Call the API to create a new host
      await hostService.createHost(hostData);
      
      // Refresh the dashboard data to include the new host
      if (activeEvent?.id) {
        dispatch(fetchHostsDashboard(activeEvent.id));
      }
      
      // Show success message
      console.log('Host added successfully!');
      
      // Close the modal
      setIsAddHostModalOpen(false);
    } catch (error) {
      console.error('Failed to add host:', error);
      console.error('Failed to add host. Please try again.');
    }
  };

  const handleEditHost = (host: HostWithAssignments) => {
    setEditingHost(host);
    setIsEditHostModalOpen(true);
  };

  const handleDeleteHost = async (hostId: string) => {
    if (!confirm('Are you sure you want to delete this host? This action cannot be undone.')) {
      return;
    }
    
    try {
      await hostService.deleteHost(hostId);
      
      // Refresh the dashboard data
      if (activeEvent?.id) {
        dispatch(fetchHostsDashboard(activeEvent.id));
      }
      
      console.log('Host deleted successfully!');
    } catch (error) {
      console.error('Failed to delete host:', error);
      console.error('Failed to delete host. Please try again.');
    }
  };

  const handleUpdateHost = async (hostId: string, hostData: any) => {
    try {
      // Call the API to update the host
      await hostService.updateHost(hostId, hostData);
      
      // Refresh the dashboard data
      if (activeEvent?.id) {
        dispatch(fetchHostsDashboard(activeEvent.id));
      }
      
      // Show success message
      console.log('Host updated successfully!');
      
      // Close the modal
      setIsEditHostModalOpen(false);
      setEditingHost(null);
    } catch (error) {
      console.error('Failed to update host:', error);
      console.error('Failed to update host. Please try again.');
    }
  };

  const handleAddParticipants = (host: HostWithAssignments) => {
    navigate(`/hosts/${host.id}/add-participants`);
  };

  const handleHostDataRefresh = () => {
    // Refresh the hosts dashboard data
    if (activeEvent?.id) {
      dispatch(fetchHostsDashboard(activeEvent.id));
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        <DashboardHeader pageName="Hosts" onMenuClick={() => setIsSidebarOpen(true)} />
        <div className="ml-0 md:ml-64 flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <Text>Loading hosts...</Text>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        <DashboardHeader pageName="Hosts" onMenuClick={() => setIsSidebarOpen(true)} />
        <div className="ml-0 md:ml-64 flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <Heading className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Failed to Load Hosts
            </Heading>
            <Text className="text-gray-600 dark:text-gray-400 mb-4">{error}</Text>
            <Button onClick={() => activeEvent?.id && dispatch(fetchHostsDashboard(activeEvent.id))} variant="primary">
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!hostsData) {
    return (
      <div className="min-h-screen">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        <DashboardHeader pageName="Hosts" onMenuClick={() => setIsSidebarOpen(true)} />
        <div className="ml-0 md:ml-64 flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-gray-400 text-6xl mb-4">🏠</div>
            <Heading className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              No Hosts Data
            </Heading>
            <Text className="text-gray-600 dark:text-gray-400">
              No event data available for hosts.
            </Text>
          </div>
        </div>
      </div>
    );
  }

  const selectedDayData = hostsData.daily_schedule.find(day => day.event_day_id === selectedDay);
  const currentPaginatedData = selectedDay ? paginatedData[selectedDay] : null;

  return (
    <div className="min-h-screen">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <DashboardHeader pageName="Hosts" onMenuClick={() => setIsSidebarOpen(true)} />
      
      <main className="ml-0 md:ml-64 overflow-y-auto">
        <div className="p-4 md:p-6 space-y-4 md:space-y-6">

          {/* Date Tabs */}
          <Card className="p-4 md:p-6">
            <Heading className="text-base md:text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Select Event Day
            </Heading>
            <DateTabs
              days={hostsData.daily_schedule as any}
              selectedDayId={selectedDay}
              onDaySelect={handleDaySelect}
            />
          </Card>

          {/* Selected Day Content */}
          {selectedDayData && currentPaginatedData && (
            <div className="space-y-4 md:space-y-6">
              {/* Day Info Card */}
              <Card className="p-4 md:p-6">
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
                      {selectedDayData.hosts.length} hosts
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

                {/* Host Statistics */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
                  <div className="bg-purple-50 dark:bg-purple-900/20 p-3 md:p-4 rounded-lg">
                    <Text className="text-xs md:text-sm font-medium text-purple-600 dark:text-purple-400">Total Hosts</Text>
                    <Text className="text-xl md:text-2xl font-bold text-purple-900 dark:text-purple-100">{selectedDayData.hosts.length}</Text>
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/20 p-3 md:p-4 rounded-lg">
                    <Text className="text-xs md:text-sm font-medium text-green-600 dark:text-green-400">Total Capacity</Text>
                    <Text className="text-xl md:text-2xl font-bold text-green-900 dark:text-green-100">
                      {selectedDayData.hosts.reduce((sum, host) => sum + host.max_participants, 0)}
                    </Text>
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-3 md:p-4 rounded-lg">
                    <Text className="text-xs md:text-sm font-medium text-blue-600 dark:text-blue-400">Avg Capacity</Text>
                    <Text className="text-xl md:text-2xl font-bold text-blue-900 dark:text-blue-100">
                      {selectedDayData.hosts.length > 0 
                        ? Math.round(selectedDayData.hosts.reduce((sum, host) => sum + host.max_participants, 0) / selectedDayData.hosts.length)
                        : 0
                      }
                    </Text>
                  </div>
                </div>
              </Card>

              {/* Bulk Upload Section */}
              <HostBulkUpload 
                eventId={activeEvent?.id || ''} 
                onUploadSuccess={() => activeEvent?.id && dispatch(fetchHostsDashboard(activeEvent.id))}
              />

              {/* Hosts Table */}
              <HostsTable
                hosts={selectedDayData.hosts}
                onPageChange={handlePageChange}
                onAddHost={handleAddHost}
                onEditHost={handleEditHost}
                onDeleteHost={handleDeleteHost}
                onAddParticipants={handleAddParticipants}
                onHostDataRefresh={handleHostDataRefresh}
                availableDays={hostsData.daily_schedule.map(day => ({
                  id: day.event_day_id,
                  date: day.event_date,
                  location: day.location_name,
                  hosts: day.hosts,
                  participants: [], // No participants in host context
                }))}
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
                Choose an event day from the tabs above to view hosts.
              </Text>
            </Card>
          )}
        </div>
      </main>

      {/* Add Host Modal */}
      <AddHostModal
        isOpen={isAddHostModalOpen}
        onClose={() => setIsAddHostModalOpen(false)}
        onSubmit={handleAddHostSubmit}
        eventId={activeEvent?.id || ''}
        eventDaysId={selectedDay || undefined}
      />

      {/* Edit Host Modal */}
      <AddHostModal
        isOpen={isEditHostModalOpen}
        onClose={() => {
          setIsEditHostModalOpen(false);
          setEditingHost(null);
        }}
        onUpdate={handleUpdateHost}
        eventId={activeEvent?.id || ''}
        editHost={editingHost}
      />
    </div>
  );
}
