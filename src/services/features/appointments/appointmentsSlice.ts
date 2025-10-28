import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Appointment } from "@shared/api";

interface AppointmentsState {
  appointments: Appointment[];
  selectedAppointment: Appointment | null;
  loading: boolean;
  error: string | null;
  pagination: {
    currentPage: number;
    totalPages: number;
    total: number;
    limit: number;
  };
  filters: {
    status?: string;
    date?: string;
    doctorId?: string;
    patientId?: string;
  };
}

const initialState: AppointmentsState = {
  appointments: [],
  selectedAppointment: null,
  loading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 0,
    total: 0,
    limit: 10,
  },
  filters: {},
};

export const appointmentsSlice = createSlice({
  name: "appointments",
  initialState,
  reducers: {
    setAppointments: (state, action: PayloadAction<Appointment[]>) => {
      state.appointments = action.payload;
    },
    setSelectedAppointment: (
      state,
      action: PayloadAction<Appointment | null>,
    ) => {
      state.selectedAppointment = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setPagination: (
      state,
      action: PayloadAction<AppointmentsState["pagination"]>,
    ) => {
      state.pagination = action.payload;
    },
    setFilters: (
      state,
      action: PayloadAction<AppointmentsState["filters"]>,
    ) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    addAppointment: (state, action: PayloadAction<Appointment>) => {
      state.appointments.unshift(action.payload);
      state.pagination.total += 1;
    },
    updateAppointment: (state, action: PayloadAction<Appointment>) => {
      const index = state.appointments.findIndex(
        (a) => a.id === action.payload.id,
      );
      if (index !== -1) {
        state.appointments[index] = action.payload;
      }
      if (state.selectedAppointment?.id === action.payload.id) {
        state.selectedAppointment = action.payload;
      }
    },
    removeAppointment: (state, action: PayloadAction<string>) => {
      state.appointments = state.appointments.filter(
        (a) => a.id !== action.payload,
      );
      state.pagination.total -= 1;
      if (state.selectedAppointment?.id === action.payload) {
        state.selectedAppointment = null;
      }
    },
    clearAppointments: (state) => {
      state.appointments = [];
      state.selectedAppointment = null;
      state.error = null;
    },
  },
});

export const {
  setAppointments,
  setSelectedAppointment,
  setLoading,
  setError,
  setPagination,
  setFilters,
  clearFilters,
  addAppointment,
  updateAppointment,
  removeAppointment,
  clearAppointments,
} = appointmentsSlice.actions;

export default appointmentsSlice.reducer;
