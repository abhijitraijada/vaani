import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { hostDashboardService } from '../services/endpoints/host.service';
import type { DashboardHostsResponse, HostDailySchedule, PaginatedHosts, HostWithAssignments } from '../services/endpoints/host.types';

export type HostState = {
  hostsData: DashboardHostsResponse | null;
  selectedDay: string | null;
  isLoading: boolean;
  error: string | null;
  // Pagination state per day
  paginatedData: Record<string, PaginatedHosts>;
  pageSize: number;
};

const initialState: HostState = {
  hostsData: null,
  selectedDay: null,
  isLoading: false,
  error: null,
  paginatedData: {},
  pageSize: 50,
};

export const fetchHostsDashboard = createAsyncThunk(
  'hosts/fetchHostsDashboard',
  async (eventId: string) => {
    const response = await hostDashboardService.getDashboardHosts(eventId);
    return response;
  }
);

const hostSlice = createSlice({
  name: 'hosts',
  initialState,
  reducers: {
    setSelectedDay: (state, action: PayloadAction<string>) => {
      state.selectedDay = action.payload;
    },
    setPageSize: (state, action: PayloadAction< number>) => {
      state.pageSize = action.payload;
    },
    updatePaginatedData: (state, action: PayloadAction <{ dayId: string; data: PaginatedHosts }>) => {
      state.paginatedData[action.payload.dayId] = action.payload.data;
    },
    clearError: (state) => {
      state.error = null;
    },
    resetHostsDashboard: (state) => {
      state.hostsData = null;
      state.selectedDay = null;
      state.paginatedData = {};
      state.error = null;
    },
    updateHostStatus: (state, action: PayloadAction <{ hostId: string; updatedHost: HostWithAssignments }>) => {
      const { hostId, updatedHost } = action.payload;
      
      if (state.hostsData) {
        // Update host in all event days
        state.hostsData.daily_schedule.forEach((day: HostDailySchedule) => {
          const hostIndex = day.hosts.findIndex(h => h.id === hostId);
          if (hostIndex !== -1) {
            day.hosts[hostIndex] = updatedHost;
          }
        });

        // Update paginated data if it exists for any day
        Object.keys(state.paginatedData).forEach(dayId => {
          const paginatedData = state.paginatedData[dayId];
          const hostIndex = paginatedData.hosts.findIndex(h => h.id === hostId);
          if (hostIndex !== -1) {
            paginatedData.hosts[hostIndex] = updatedHost;
          }
        });
      }
    },
    addHost: (state, action: PayloadAction<HostWithAssignments>) => {
      const newHost = action.payload;
      
      if (state.hostsData && state.selectedDay) {
        const selectedDayData = state.hostsData.daily_schedule.find(day => day.event_day_id === state.selectedDay);
        if (selectedDayData) {
          selectedDayData.hosts.push(newHost);
          
          // Update paginated data
          const paginatedData = state.paginatedData[state.selectedDay];
          if (paginatedData) {
            paginatedData.hosts.push(newHost);
            paginatedData.totalCount += 1;
            paginatedData.totalPages = Math.ceil(paginatedData.totalCount / state.pageSize);
          }
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHostsDashboard.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchHostsDashboard.fulfilled, (state, action: PayloadAction<DashboardHostsResponse>) => {
        state.isLoading = false;
        state.hostsData = action.payload;
        state.selectedDay = action.payload.daily_schedule[0]?.event_day_id || null;
        
        // Initialize paginated data for each day
        action.payload.daily_schedule.forEach((day: HostDailySchedule) => {
          const totalPages = Math.ceil(day.hosts.length / state.pageSize);
          state.paginatedData[day.event_day_id] = {
            hosts: day.hosts.slice(0, state.pageSize),
            totalPages,
            currentPage: 1,
            totalCount: day.hosts.length,
          };
        });
      })
      .addCase(fetchHostsDashboard.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch hosts data';
      });
  },
});

export const { 
  setSelectedDay, 
  setPageSize, 
  updatePaginatedData, 
  clearError, 
  resetHostsDashboard,
  updateHostStatus,
  addHost
} = hostSlice.actions;

export default hostSlice.reducer;
