import { useEffect, useState } from 'react';
import { useAppSelector } from '../store';
import { Sidebar } from '../components/navigation/Sidebar';
import { DashboardHeader } from '../components/navigation/DashboardHeader';
import { Card } from '../components/primitives/Layout';
import { Heading, Text } from '../components/primitives/Typography';
import { Button } from '../components/primitives/Button';
import { AddHostModal } from '../components/dashboard/AddHostModal';
import { HostsTable } from '../components/dashboard/HostsTable';
import { HostBulkUpload } from '../components/dashboard/HostBulkUpload';
import { hostService } from '../services/endpoints/host.service';
import type { CreateHostRequest, Host, HostsResponse } from '../services/endpoints/host.types';

export default function HostsSimple() {
  const [hosts, setHosts] = useState<Host[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAddHostModalOpen, setIsAddHostModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Get the active event ID from the events state
  const { activeEvent } = useAppSelector((state) => state.events);

  const pageSize = 50;

  // Load hosts when component mounts or event changes
  useEffect(() => {
    if (activeEvent?.id) {
      loadHosts();
    }
  }, [activeEvent?.id]);

  const loadHosts = async () => {
    if (!activeEvent?.id) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response: HostsResponse = await hostService.getHostsByEvent(activeEvent.id, {
        page: currentPage,
        page_size: pageSize,
        ...(searchTerm && { name: searchTerm })
      });
      
      setHosts(response.hosts);
      setTotalPages(response.total_pages);
    } catch (err: any) {
      console.error('Failed to load hosts:', err);
      setError(err.message || 'Failed to load hosts');
    } finally {
      setIsLoading(false);
    }
  };

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

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
    // Debounce search
    setTimeout(() => {
      if (term === searchTerm) {
        loadHosts();
      }
    }, 500);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    loadHosts();
  };

  const handleAddHost = () => {
    setIsAddHostModalOpen(true);
  };

  const handleAddHostSubmit = async (hostData: CreateHostRequest) => {
    try {
      // Call the API to create a new host
      const newHost = await hostService.createHost(hostData);
      
      // Add the new host to the list
      setHosts(prev => [newHost, ...prev]);
      
      // Show success message
      console.log('Host added successfully!');
      
      // Close the modal
      setIsAddHostModalOpen(false);
    } catch (error) {
      console.error('Failed to add host:', error);
      console.error('Failed to add host. Please try again.');
    }
  };


  // Convert Host to HostWithAssignments for table compatibility
  const hostsWithAssignments = hosts.map(host => ({
    ...host,
    assignments: [], // No assignments for now
    current_capacity: 0, // No current capacity data
  }));

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Sidebar />
        <DashboardHeader pageName="Hosts" />
        <div className="ml-64 flex items-center justify-center h-64">
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
        <Sidebar />
        <DashboardHeader pageName="Hosts" />
        <div className="ml-64 flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <Heading className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Failed to Load Hosts
            </Heading>
            <Text className="text-gray-600 dark:text-gray-400 mb-4">{error}</Text>
            <Button onClick={loadHosts} variant="primary">
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Sidebar />
      <DashboardHeader pageName="Hosts" />
      
      <main className="ml-64 overflow-y-auto">
        <div className="p-6 space-y-6">
          
          {/* Header Section */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <Heading className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                  Host Management
                </Heading>
                <Text className="text-gray-600 dark:text-gray-400 mt-1">
                  Manage hosts for {activeEvent?.event_name || 'the current event'}
                </Text>
              </div>
              <Button
                variant="primary"
                onClick={handleAddHost}
              >
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span>Add Host</span>
                </div>
              </Button>
            </div>
            
            {/* Host Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                <Text className="text-sm font-medium text-purple-600 dark:text-purple-400">Total Hosts</Text>
                <Text className="text-2xl font-bold text-purple-900 dark:text-purple-100">{hosts.length}</Text>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <Text className="text-sm font-medium text-green-600 dark:text-green-400">Total Capacity</Text>
                <Text className="text-2xl font-bold text-green-900 dark:text-green-100">
                  {hosts.reduce((sum, host) => sum + host.max_participants, 0)}
                </Text>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <Text className="text-sm font-medium text-blue-600 dark:text-blue-400">Average Capacity</Text>
                <Text className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                  {hosts.length > 0 
                    ? Math.round(hosts.reduce((sum, host) => sum + host.max_participants, 0) / hosts.length)
                    : 0
                  }
                </Text>
              </div>
            </div>
          </Card>

          {/* Bulk Upload Section */}
          <HostBulkUpload 
            eventId={activeEvent?.id || ''} 
            onUploadSuccess={loadHosts}
          />

          {/* Hosts Table */}
          <HostsTable
            hosts={hostsWithAssignments}
            onPageChange={handlePageChange}
            onAddHost={handleAddHost}
            onSearch={handleSearch}
            className="mb-6"
          />

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <Text className="text-sm text-gray-700 dark:text-gray-300">
                  Page {currentPage} of {totalPages}
                </Text>
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* Empty State */}
          {hosts.length === 0 && !isLoading && (
            <Card className="p-12 text-center">
              <div className="text-gray-400 text-6xl mb-4">🏠</div>
              <Heading className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                No Hosts Found
              </Heading>
              <Text className="text-gray-600 dark:text-gray-400 mb-6">
                {searchTerm 
                  ? `No hosts match your search "${searchTerm}"`
                  : 'No hosts have been added yet. Add your first host to get started.'
                }
              </Text>
              <Button onClick={handleAddHost} variant="primary">
                Add First Host
              </Button>
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
      />
    </div>
  );
}
