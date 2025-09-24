import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { dashboardService } from '../services/endpoints/dashboard.service';
import type { DashboardResponse, EventDay, PaginatedParticipants, Participant } from '../services/endpoints/dashboard.types';

export type DashboardState = {
  eventData: DashboardResponse | null;
  selectedDay: string | null;
  isLoading: boolean;
  error: string | null;
  // Pagination state per day
  paginatedData: Record<string, PaginatedParticipants>;
  pageSize: number;
};

const initialState: DashboardState = {
  eventData: null,
  selectedDay: null,
  isLoading: false,
  error: null,
  paginatedData: {},
  pageSize: 50,
};

export const fetchEventDashboard = createAsyncThunk(
  'dashboard/fetchEventDashboard',
  async (eventId: string) => {
    const response = await dashboardService.getEventDashboard(eventId);
    return response;
  }
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setSelectedDay: (state, action: PayloadAction<string>) => {
      state.selectedDay = action.payload;
    },
    setPageSize: (state, action: PayloadAction<number>) => {
      state.pageSize = action.payload;
    },
    updatePaginatedData: (state, action: PayloadAction<{ dayId: string; data: PaginatedParticipants }>) => {
      state.paginatedData[action.payload.dayId] = action.payload.data;
    },
    clearError: (state) => {
      state.error = null;
    },
    resetDashboard: (state) => {
      state.eventData = null;
      state.selectedDay = null;
      state.paginatedData = {};
      state.error = null;
    },
    updateParticipantStatus: (state, action: PayloadAction<{ participantId: string; updatedParticipant: Participant }>) => {
      const { participantId, updatedParticipant } = action.payload;
      
      if (state.eventData) {
        // Update participant in all event days
        state.eventData.daily_schedule.forEach((day: EventDay) => {
          const participantIndex = day.participants.findIndex(p => p.id === participantId);
          if (participantIndex !== -1) {
            day.participants[participantIndex] = updatedParticipant;
          }
        });

        // Update paginated data if it exists for any day
        Object.keys(state.paginatedData).forEach(dayId => {
          const paginatedData = state.paginatedData[dayId];
          const participantIndex = paginatedData.participants.findIndex(p => p.id === participantId);
          if (participantIndex !== -1) {
            paginatedData.participants[participantIndex] = updatedParticipant;
          }
        });
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEventDashboard.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchEventDashboard.fulfilled, (state, action: PayloadAction<DashboardResponse>) => {
        state.isLoading = false;
        state.eventData = action.payload;
        state.selectedDay = action.payload.daily_schedule[0]?.event_day_id || null;
        
        // Initialize paginated data for each day
        action.payload.daily_schedule.forEach((day: EventDay) => {
          const totalPages = Math.ceil(day.participants.length / state.pageSize);
          state.paginatedData[day.event_day_id] = {
            participants: day.participants.slice(0, state.pageSize),
            totalPages,
            currentPage: 1,
            totalCount: day.participants.length,
          };
        });
      })
      .addCase(fetchEventDashboard.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch dashboard data';
      });
  },
});

export const { 
  setSelectedDay, 
  setPageSize, 
  updatePaginatedData, 
  clearError, 
  resetDashboard,
  updateParticipantStatus
} = dashboardSlice.actions;

export default dashboardSlice.reducer;
