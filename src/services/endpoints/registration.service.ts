import { BaseService } from '../base.service';
import type { RegistrationRequest, RegistrationResponse, SearchParticipantResponse } from './registration.types';
import api from '../../lib/api';

class RegistrationService extends BaseService {
  constructor() {
    super('/v1/registrations/');
  }

  async register(data: RegistrationRequest): Promise<RegistrationResponse> {
    const response = await api.post<RegistrationResponse>(`${this.endpoint}`, data);
    return response.data;
  }

  async searchParticipant(phoneNumber: string): Promise<SearchParticipantResponse> {
    const response = await api.get<SearchParticipantResponse>(`${this.endpoint}search/participant?phone_number=${encodeURIComponent(phoneNumber)}`);
    return response.data;
  }
}

export const registrationService = new RegistrationService();
