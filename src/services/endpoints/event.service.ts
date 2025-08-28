import { BaseService } from '../base.service';
import api from '../../lib/api';

type EventDay = {
  event_date: string;
  breakfast_provided: boolean;
  lunch_provided: boolean;
  dinner_provided: boolean;
  location_name: string;
  daily_notes: string;
  id: string;
  event_id: string;
}

export type Event = {
  event_name: string;
  start_date: string;
  end_date: string;
  location_name: string;
  location_map_link: string | null;
  description: string;
  ngo: string;
  is_active: boolean;
  allowed_registration: number;
  registration_start_date: string;
  id: string;
  event_days: EventDay[];
  created_at: string;
  updated_at: string;
}

type EventsResponse = {
  events: Event[];
}

class EventService extends BaseService {
  constructor() {
    super('/v1/events/');
  }

  async getEvents(): Promise<EventsResponse> {
    const response = await api.get<EventsResponse>(`${this.endpoint}`);
    return response.data;
  }
}

export const eventService = new EventService();
