import { BaseService } from '../base.service';
import type { RegistrationRequest, RegistrationResponse } from './registration.types';
import api from '../../lib/api';

class RegistrationService extends BaseService {
  constructor() {
    super('/v1/registrations/');
  }

  async register(data: RegistrationRequest): Promise<RegistrationResponse> {
    const response = await api.post<RegistrationResponse>(`${this.endpoint}`, data);
    return response.data;
  }
}

export const registrationService = new RegistrationService();
