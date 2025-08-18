import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RegistrationType } from '../components/participant/RegistrationTypeSelector';
import type { PersonalDetailsValues } from '../components/participant/PersonalDetailsForm';
import type { GroupMember } from '../components/participant/GroupMembersAccordion';
import type { TransportType } from '../components/participant/TransportTypeSelector';
import type { VehicleDetails } from '../components/participant/VehicleDetailsFields';
import type { DayPreferences } from '../components/participant/DailyPreferencesForm';

export type RegistrationDraftState = {
  registrationType: RegistrationType;
  personal: PersonalDetailsValues;
  group: GroupMember[];
  transportType: TransportType;
  vehicle: VehicleDetails;
  preferencesByDate: Record<string, DayPreferences>;
};

const initialState: RegistrationDraftState = {
  registrationType: 'individual',
  personal: {
    name: '',
    email: '',
    phone: '',
    city: '',
    age: undefined,
    floor: undefined,
    language: '',
  },
  group: [],
  transportType: 'public',
  vehicle: {
    vehicleMake: '',
    vehicleNumber: '',
    hasEmptySeats: false,
    availableSeats: undefined,
  },
  preferencesByDate: {},
};

const registrationSlice = createSlice({
  name: 'registrationDraft',
  initialState,
  reducers: {
    setRegistrationType(state, action: PayloadAction<RegistrationType>) {
      state.registrationType = action.payload;
    },
    patchPersonal(state, action: PayloadAction<Partial<PersonalDetailsValues>>) {
      state.personal = { ...state.personal, ...action.payload };
    },
    addGroupMember(state) {
      state.group.push({ name: '', email: '', phone: '' });
    },
    removeGroupMember(state, action: PayloadAction<number>) {
      state.group.splice(action.payload, 1);
    },
    patchGroupMember(state, action: PayloadAction<{ index: number; patch: Partial<GroupMember> }>) {
      const { index, patch } = action.payload;
      const current = state.group[index];
      if (current) state.group[index] = { ...current, ...patch };
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
        stayingWithYatra: true,
        dinnerAtHost: true,
        breakfastAtHost: true,
        lunchWithYatra: true,
        physicalLimitations: '',
        toiletPreference: undefined,
      } as DayPreferences;
      state.preferencesByDate[date] = { ...prev, ...prefs };
    },
    resetDraft() {
      return initialState;
    },
  },
});

export const {
  setRegistrationType,
  patchPersonal,
  addGroupMember,
  removeGroupMember,
  patchGroupMember,
  setTransportType,
  patchVehicle,
  setDayPreferences,
  resetDraft,
} = registrationSlice.actions;

export default registrationSlice.reducer;


