export type Participant = {
  id: string;
  name: string;
  phone_number: string;
  email: string;
  city: string;
  age: number;
  gender: 'M' | 'F';
  language: string;
  floor_preference: string;
  special_requirements: string | null;
  status: 'registered' | 'waiting' | 'confirmed' | 'cancelled';
  created_at: string;
  updated_at: string;
  staying_with_yatra: boolean;
  dinner_at_host: boolean;
  breakfast_at_host: boolean;
  lunch_with_yatra: boolean;
  physical_limitations: string | null;
  toilet_preference: 'indian' | 'western';
  group_id: number;
  registration_type: 'group' | 'individual';
  transportation_mode: 'private' | 'public';
  has_empty_seats: boolean;
  available_seats_count: number;
  notes: string | null;
  // Host assignment details (if assigned)
  host_id?: string;
  host_name?: string;
  host_place_name?: string;
  host_phone_no?: number;
};

export type EventDay = {
  event_day_id: string;
  event_date: string;
  location_name: string;
  breakfast_provided: boolean;
  lunch_provided: boolean;
  dinner_provided: boolean;
  daily_notes: string;
  participants: Participant[];
};

export type SummaryStats = {
  total_groups: number;
  individual_registrations: number;
  group_registrations: number;
  public_transport: number;
  private_transport: number;
  groups_with_empty_seats: number;
  total_empty_seats: number;
  gender_distribution: {
    M: number;
    F: number;
  };
  age_groups: {
    '0-18': number;
    '19-30': number;
    '31-50': number;
    '51+': number;
  };
  city_distribution: Record<string, number>;
  toilet_preferences: {
    indian: number;
    western: number;
  };
  daily_toilet_preferences: Record<string, {
    indian: number;
    western: number;
  }>;
};

export type DashboardResponse = {
  event_id: string;
  event_name: string;
  event_start_date: string;
  event_end_date: string;
  total_registrations: number;
  total_participants: number;
  confirmed_participants: number;
  waiting_participants: number;
  daily_schedule: EventDay[];
  summary: SummaryStats;
};

export type PaginatedParticipants = {
  participants: Participant[];
  totalPages: number;
  currentPage: number;
  totalCount: number;
};

