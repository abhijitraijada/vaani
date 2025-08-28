export type Gender = 'M' | 'F' | 'O';
export type FloorPreference = 'Ground' | 'First' | 'Any';
export type ToiletPreference = 'indian' | 'western';
export type MemberStatus = 'registered' | 'cancelled';

export interface RegistrationMember {
  name: string;
  phone_number: string;
  email: string;
  city: string;
  age: number;
  gender: Gender;
  language: string;
  floor_preference: FloorPreference;
  special_requirements?: string;
  status: MemberStatus;
}

export interface DailyPreference {
  event_day_id: string;
  staying_with_yatra: boolean;
  dinner_at_host: boolean;
  breakfast_at_host: boolean;
  lunch_with_yatra: boolean;
  physical_limitations?: string;
  toilet_preference: ToiletPreference | null;
}

export interface RegistrationRequest {
  event_id: string;
  registration_type: 'individual' | 'group';
  number_of_members: number;
  transportation_mode: 'public' | 'private';
  has_empty_seats: boolean;
  available_seats_count?: number;
  notes?: string;
  members: RegistrationMember[];
  daily_preferences: DailyPreference[];
}

export interface RegistrationResponse extends Omit<RegistrationRequest, 'members' | 'daily_preferences'> {
  id: number;
  created_at: string;
  updated_at: string;
  members: (RegistrationMember & {
    id: string;
    registration_id: number;
    created_at: string;
    updated_at: string;
  })[];
  daily_preferences: (DailyPreference & {
    id: string;
    registration_id: number;
    created_at: string;
    updated_at: string;
  })[];
}
