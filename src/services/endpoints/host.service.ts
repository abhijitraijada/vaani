import { BaseService } from '../base.service';
import api from '../../lib/api';
import type { 
  Host, 
  CreateHostRequest, 
  UpdateHostRequest, 
  HostsListQuery, 
  HostsByEventResponse,
  HostEventDay,
  HostAssignment,
  CreateHostAssignmentRequest,
  UpdateHostAssignmentRequest,
  HostAssignmentsQuery,
  HostAssignmentsResponse,
  HostBulkUploadResponse,
  DashboardHostsResponse,
  HostDailySchedule,
  HostWithAssignments
} from './host.types';

export class HostService extends BaseService {
  constructor() {
    super('/v1/hosts');
  }

  // Host Management Methods
  
  async createHost(hostData: CreateHostRequest): Promise<Host> {
    const response = await api.post<Host>('/v1/hosts', hostData);
    return response.data;
  }

  async getHostsByEvent(eventId: string, query?: HostsListQuery): Promise<HostsByEventResponse> {
    const queryParams = new URLSearchParams();
    
    if (query) {
      Object.entries(query)?.forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const path = `/v1/hosts/event/${eventId}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await api.get<HostsByEventResponse>(path);
    return response.data;
  }

  async getHost(hostId: string): Promise<Host> {
    const response = await api.get<Host>(`/v1/hosts/${hostId}`);
    return response.data;
  }

  async updateHost(hostId: string, hostData: UpdateHostRequest): Promise<Host> {
    const response = await api.put<Host>(`/v1/hosts/${hostId}`, hostData);
    return response.data;
  }

  async deleteHost(hostId: string): Promise<{ message: string; deleted_host_id: string }> {
    const response = await api.delete<{ message: string; deleted_host_id: string }>(`/v1/hosts/${hostId}`);
    return response.data;
  }
}

export class HostAssignmentService extends BaseService {
  constructor() {
    super('/v1/host-assignments');
  }

  // Host Assignment Methods
  
  async createHostAssignment(assignmentData: CreateHostAssignmentRequest): Promise<HostAssignment> {
    const response = await api.post<HostAssignment>('/v1/host-assignments', assignmentData);
    return response.data;
  }

  async getHostAssignments(query?: HostAssignmentsQuery): Promise<HostAssignmentsResponse> {
    const queryParams = new URLSearchParams();
    
    if (query) {
      Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const path = `/v1/host-assignments${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await api.get<HostAssignmentsResponse>(path);
    return response.data;
  }

  async getHostAssignment(assignmentId: string): Promise<HostAssignment> {
    const response = await api.get<HostAssignment>(`/v1/host-assignments/${assignmentId}`);
    return response.data;
  }

  async updateHostAssignment(assignmentId: string, assignmentData: UpdateHostAssignmentRequest): Promise<HostAssignment> {
    const response = await api.put<HostAssignment>(`/v1/host-assignments/${assignmentId}`, assignmentData);
    return response.data;
  }

  async deleteHostAssignment(assignmentId: string): Promise<{ message: string; deleted_assignment_id: string }> {
    const response = await api.delete<{ message: string; deleted_assignment_id: string }>(`/v1/host-assignments/${assignmentId}`);
    return response.data;
  }
}

export class HostDashboardService extends BaseService {
  constructor() {
    super('/v1/hosts');
  }

  // Dashboard-specific methods
  
  async getDashboardHosts(eventId: string): Promise<DashboardHostsResponse> {
    // Use the new API structure that returns hosts grouped by event days
    const hostsResponse = await hostService.getHostsByEvent(eventId);
    const dailySchedule: HostDailySchedule[] = [];
    
    // Transform the new API response to match the dashboard structure
    hostsResponse.event_days.forEach((eventDay: HostEventDay) => {
      const hostsWithAssignments: HostWithAssignments[] = eventDay.hosts.map((host: Host) => ({
        ...host,
        assignments: [], // We'll fetch these separately if needed
        current_capacity: 0, // This would need to be calculated from assignments
      }));
      
      dailySchedule.push({
        event_day_id: eventDay.event_day_id,
        event_date: eventDay.event_date,
        location_name: 'Event Location', // This would come from event service
        hosts: hostsWithAssignments,
        daily_notes: '',
      });
    });
    
    return {
      event_id: eventId,
      daily_schedule: dailySchedule,
    };
  }

  async bulkUploadHosts(eventId: string, csvFile: File): Promise<HostBulkUploadResponse> {
    const formData = new FormData();
    formData.append('file', csvFile);
    
    // When sending FormData, we need to delete the default Content-Type header
    // so axios can set the correct multipart/form-data with boundary
    const response = await api.post<HostBulkUploadResponse>(
      `/v1/hosts/upload/${eventId}`, 
      formData,
      {
        headers: {
          'Content-Type': undefined as any, // Remove default Content-Type
        },
        transformRequest: [(data) => data], // Prevent JSON transformation
      }
    );
    return response.data;
  }
}

// Export services as singletons (similar to existing pattern)
export const hostService = new HostService();
export const hostAssignmentService = new HostAssignmentService();
export const hostDashboardService = new HostDashboardService();
