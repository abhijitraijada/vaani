import { BaseService } from '../base.service';
import api from '../../lib/api';

// Assignment Types
export interface Assignment {
  id: string;
  host_id: string;
  registration_member_id: string;
  event_day_id: string;
  assignment_notes?: string;
  assigned_by: string;
  created_at: string;
  updated_at: string;
}

export interface BulkAssignmentRequest {
  host_id: string;
  registration_member_ids: string[];
  event_day_id: string;
  assignment_notes?: string;
}

export interface BulkAssignmentResponse {
  total_requested: number;
  successful_assignments: number;
  failed_assignments: number;
  assignments: Assignment[];
  errors: string[];
}

export interface AssignmentError {
  detail: string;
}

export interface DeleteAssignmentResponse {
  message: string;
  deleted_assignment_id: string;
}

export interface AssignmentsResponse {
  assignments: Assignment[];
  total_count: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface AssignmentsQueryParams {
  page?: number;
  page_size?: number;
  host_id?: string;
  event_day_id?: string;
  registration_member_id?: string;
}

export class AssignmentService extends BaseService {
  constructor() {
    super('/api/v1/host-assignments');
  }

  /**
   * Create multiple host assignments in a single request
   * @param data - Bulk assignment request data
   * @returns Promise with assignment results
   */
  async createBulkHostAssignments(data: BulkAssignmentRequest): Promise<BulkAssignmentResponse> {
    const response = await api.post<BulkAssignmentResponse>('/v1/host-assignments/bulk', data);
    return response.data;
  }

  /**
   * Get assignments for a specific host
   * @param hostId - Host ID
   * @param eventDayId - Event day ID (optional)
   * @returns Promise with assignments
   */
  async getHostAssignments(hostId: string, eventDayId?: string): Promise<Assignment[]> {
    const params = eventDayId ? `?event_day_id=${eventDayId}` : '';
    const response = await api.get<Assignment[]>(`/v1/host-assignments/host/${hostId}${params}`);
    return response.data;
  }

  /**
   * Get all assignments with optional filtering and pagination
   * @param params - Query parameters for filtering and pagination
   * @returns Promise with assignments and pagination info
   */
  async getAllAssignments(params: AssignmentsQueryParams = {}): Promise<AssignmentsResponse> {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.page_size) queryParams.append('page_size', params.page_size.toString());
    if (params.host_id) queryParams.append('host_id', params.host_id);
    if (params.event_day_id) queryParams.append('event_day_id', params.event_day_id);
    if (params.registration_member_id) queryParams.append('registration_member_id', params.registration_member_id);
    
    const queryString = queryParams.toString();
    const url = `/v1/host-assignments/${queryString ? `?${queryString}` : ''}`;
    
    const response = await api.get<AssignmentsResponse>(url);
    return response.data;
  }

  /**
   * Delete a specific assignment
   * @param assignmentId - Assignment ID
   * @returns Promise with deletion result
   */
  async deleteAssignment(assignmentId: string): Promise<DeleteAssignmentResponse> {
    const response = await api.delete<DeleteAssignmentResponse>(`/v1/host-assignments/${assignmentId}`);
    return response.data;
  }
}

export const assignmentService = new AssignmentService();
