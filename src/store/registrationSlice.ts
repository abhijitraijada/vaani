import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { TransportType } from '../components/participant/TransportTypeSelector';
import type { VehicleDetails } from '../components/participant/VehicleDetailsFields';
import type { DayPreferences } from '../components/participant/DailyPreferencesForm';
import type { Participant } from '../components/participant/ParticipantRegistrationForm';

export type RegistrationDraftState = {
  participants: Participant[];
  transportType: TransportType;
  vehicle: VehicleDetails;
  preferencesByDate: Record<string, DayPreferences>;
};

const initialState: RegistrationDraftState = {
  participants: [{
    name: '',
    email: '',
    phone: '',
    city: '',
    age: null as number | null,
    gender: 'M',
    language: '',
  }],
  transportType: null,
  vehicle: {
    hasEmptySeats: false,
    availableSeats: undefined,
  },
  preferencesByDate: {},
};

const registrationSlice = createSlice({
  name: 'registrationDraft',
  initialState,
  reducers: {
    addParticipant(state) {
      state.participants.push({
            name: '',
    email: '',
    phone: '',
    city: '',
    age: null as number | null,
    gender: 'M',
    language: '',
      });
    },
    removeParticipant(state, action: PayloadAction<number>) {
      if (state.participants.length > 1) {
        state.participants.splice(action.payload, 1);
      }
    },
    updateParticipant(state, action: PayloadAction<{ index: number; patch: Partial<Participant> }>) {
      const { index, patch } = action.payload;
      const current = state.participants[index];
      if (current) {
        state.participants[index] = { ...current, ...patch };
      }
    },
    setTransportType(state, action: PayloadAction<TransportType>) {
      state.transportType = action.payload;
      if (action.payload === 'public') {
        state.vehicle.hasEmptySeats = false;
        state.vehicle.availableSeats = undefined;
      }
    },
    patchVehicle(state, action: PayloadAction<Partial<VehicleDetails>>) {
      state.vehicle = { ...state.vehicle, ...action.payload };
    },
    setDayPreferences(state, action: PayloadAction<{ date: string; prefs: Partial<DayPreferences> }>) {
      const { date, prefs } = action.payload;
      const prev = state.preferencesByDate[date] ?? {
        attending: null,
        stayingWithYatra: true,
        dinnerAtHost: true,
        breakfastAtHost: true,
        lunchWithYatra: true,
        physicalLimitations: '',
        toiletPreference: null,
      } as DayPreferences;
      state.preferencesByDate[date] = { ...prev, ...prefs };
    },
    resetDraft() {
      return initialState;
    },
  },
});

export const {
  addParticipant,
  removeParticipant,
  updateParticipant,
  setTransportType,
  patchVehicle,
  setDayPreferences,
  resetDraft,
} = registrationSlice.actions;

export default registrationSlice.reducer;