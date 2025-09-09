import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { ExportOptions } from '../services/export/export.types';

interface ExportState {
  isExporting: boolean;
  progress: number;
  currentStep: string;
  error: string | null;
  lastExportOptions: ExportOptions | null;
}

const initialState: ExportState = {
  isExporting: false,
  progress: 0,
  currentStep: '',
  error: null,
  lastExportOptions: null,
};

const exportSlice = createSlice({
  name: 'export',
  initialState,
  reducers: {
    startExport: (state, action: PayloadAction<ExportOptions>) => {
      state.isExporting = true;
      state.progress = 0;
      state.currentStep = 'Starting export...';
      state.error = null;
      state.lastExportOptions = action.payload;
    },
    updateProgress: (state, action: PayloadAction<{ progress: number; step: string }>) => {
      state.progress = action.payload.progress;
      state.currentStep = action.payload.step;
    },
    completeExport: (state) => {
      state.isExporting = false;
      state.progress = 100;
      state.currentStep = 'Export completed!';
      state.error = null;
    },
    failExport: (state, action: PayloadAction<string>) => {
      state.isExporting = false;
      state.progress = 0;
      state.currentStep = 'Export failed';
      state.error = action.payload;
    },
    resetExport: (state) => {
      state.isExporting = false;
      state.progress = 0;
      state.currentStep = '';
      state.error = null;
    },
  },
});

export const {
  startExport,
  updateProgress,
  completeExport,
  failExport,
  resetExport,
} = exportSlice.actions;

export default exportSlice.reducer;
