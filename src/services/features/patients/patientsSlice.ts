import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Patient } from "@shared/api";

interface PatientsState {
  patients: Patient[];
  selectedPatient: Patient | null;
  loading: boolean;
  error: string | null;
  pagination: {
    currentPage: number;
    totalPages: number;
    total: number;
    limit: number;
  };
}

const initialState: PatientsState = {
  patients: [],
  selectedPatient: null,
  loading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 0,
    total: 0,
    limit: 10,
  },
};

export const patientsSlice = createSlice({
  name: "patients",
  initialState,
  reducers: {
    setPatients: (state, action: PayloadAction<Patient[]>) => {
      state.patients = action.payload;
    },
    setSelectedPatient: (state, action: PayloadAction<Patient | null>) => {
      state.selectedPatient = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setPagination: (
      state,
      action: PayloadAction<PatientsState["pagination"]>,
    ) => {
      state.pagination = action.payload;
    },
    addPatient: (state, action: PayloadAction<Patient>) => {
      state.patients.unshift(action.payload);
      state.pagination.total += 1;
    },
    updatePatient: (state, action: PayloadAction<Patient>) => {
      const index = state.patients.findIndex((p) => p.id === action.payload.id);
      if (index !== -1) {
        state.patients[index] = action.payload;
      }
      if (state.selectedPatient?.id === action.payload.id) {
        state.selectedPatient = action.payload;
      }
    },
    removePatient: (state, action: PayloadAction<string>) => {
      state.patients = state.patients.filter((p) => p.id !== action.payload);
      state.pagination.total -= 1;
      if (state.selectedPatient?.id === action.payload) {
        state.selectedPatient = null;
      }
    },
    clearPatients: (state) => {
      state.patients = [];
      state.selectedPatient = null;
      state.error = null;
    },
  },
});

export const {
  setPatients,
  setSelectedPatient,
  setLoading,
  setError,
  setPagination,
  addPatient,
  updatePatient,
  removePatient,
  clearPatients,
} = patientsSlice.actions;

export default patientsSlice.reducer;
