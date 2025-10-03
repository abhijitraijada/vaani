// Host-related type definitions

export type ToiletFacilities = 'indian' | 'western' | 'both';
export type GenderPreference = 'male' | 'female' | 'both';

export interface Host {
  id: string;
  event_id: string;
  event_days_id: string;
  event_date: string;
  name: string;
  phone_no: number;
  place_name: string;
  max_participants: number;
  toilet_facilities: ToiletFacilities;
  gender_preference: GenderPreference;
  facilities_description: string;
  created_at: string;
  updated_at: string;
}

export interface CreateHostRequest {
  event_id: string;
  event_days_id: string;
  name: string;
  phone_no: number;
  place_name: string;
  max_participants: number;
  toilet_facilities: ToiletFacilities;
  gender_preference: GenderPreference;
  facilities_description: string;
}

export interface UpdateHostRequest {
  event_days_id?: string;
  name?: string;
  phone_no?: number;
  place_name?: string;
  max_participants?: number;
  toilet_facilities?: ToiletFacilities;
  gender_preference?: GenderPreference;
  facilities_description?: string;
}

export interface HostsListQuery {
  name?: string;
  phone_no?: number;
  place_name?: string;
  min_capacity?: number;
  max_capacity?: number;
  toilet_facilities?: ToiletFacilities;
  gender_preference?: GenderPreference;
  has_facilities_description?: boolean;
  page?: number;
  page_size?: number;
}

export interface HostsResponse {
  hosts: Host[];
  total_count: number;
  page: number;
  page_size: number;
  total_pages: number;
}

// New API response structure for hosts by event
export interface HostsByEventResponse {
  event_id: string;
  event_days: HostEventDay[];
  total_hosts: number;
}

export interface HostEventDay {
  event_date: string;
  event_day_id: string;
  hosts: Host[];
  total_hosts: number;
}

export interface HostAssignment {
  id: string;
  host_id: string;
  registration_member_id: string;
  event_day_id: string;
  assignment_notes: string;
  assigned_by: string;
  created_at: string;
  updated_at: string;
}

export interface CreateHostAssignmentRequest {
  host_id: string;
  registration_member_id: string;
  event_day_id: string;
  assignment_notes?: string;
}

export interface UpdateHostAssignmentRequest {
  assignment_notes?: string;
}

export interface HostAssignmentsQuery {
  host_id?: string;
  registration_member_id?: string;
  event_day_id?: string;
  assigned_by?: string;
  has_notes?: boolean;
  page?: number;
  page_size?: number;
}

export interface HostAssignmentsResponse {
  assignments: HostAssignment[];
  total_count: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface HostBulkUploadResponse {
  total_rows: number;
  successful_imports: number;
  failed_imports: number;
  errors: string[];
}

export interface HostWithAssignments extends Host {
  assignments: HostAssignment[];
  current_capacity: number;
}

// Dashboard-specific types for hosts
export interface DashboardHostsResponse {
  event_id: string;
  daily_schedule: HostDailySchedule[];
}

export interface HostDailySchedule {
  event_day_id: string;
  event_date: string;
  location_name: string;
  hosts: HostWithAssignments[];
  daily_notes?: string;
}

export type PaginatedHosts = {
  hosts: HostWithAssignments[];
  totalPages: number;
  currentPage: number;
  totalCount: number;
};
