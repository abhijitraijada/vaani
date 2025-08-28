import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { eventService } from '../services/endpoints/event.service';
import type { Event } from '../services/endpoints/event.service';

export type EventState = {
  events: Event[];
  activeEvent: Event | null;
  isLoading: boolean;
  error: string | null;
};

const initialState: EventState = {
  events: [],
  activeEvent: null,
  isLoading: false,
  error: null,
};

export const fetchEvents = createAsyncThunk(
  'events/fetchEvents',
  async () => {
    const response = await eventService.getEvents();
    return response.events;
  }
);

const eventSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchEvents.fulfilled, (state, action: PayloadAction<Event[]>) => {
        state.isLoading = false;
        state.events = action.payload;
        state.activeEvent = action.payload.find(event => event.is_active) || null;
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch events';
      });
  },
});

export default eventSlice.reducer;
