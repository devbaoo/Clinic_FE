import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Prescription } from "@shared/api";

interface PrescriptionsState {
  prescriptions: Prescription[];
  selectedPrescription: Prescription | null;
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
    patientId?: string;
    doctorId?: string;
  };
}

const initialState: PrescriptionsState = {
  prescriptions: [],
  selectedPrescription: null,
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

export const prescriptionsSlice = createSlice({
  name: "prescriptions",
  initialState,
  reducers: {
    setPrescriptions: (state, action: PayloadAction<Prescription[]>) => {
      state.prescriptions = action.payload;
    },
    setSelectedPrescription: (
      state,
      action: PayloadAction<Prescription | null>,
    ) => {
      state.selectedPrescription = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setPagination: (
      state,
      action: PayloadAction<PrescriptionsState["pagination"]>,
    ) => {
      state.pagination = action.payload;
    },
    setFilters: (
      state,
      action: PayloadAction<PrescriptionsState["filters"]>,
    ) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    addPrescription: (state, action: PayloadAction<Prescription>) => {
      state.prescriptions.unshift(action.payload);
      state.pagination.total += 1;
    },
    updatePrescription: (state, action: PayloadAction<Prescription>) => {
      const index = state.prescriptions.findIndex(
        (p) => p.id === action.payload.id,
      );
      if (index !== -1) {
        state.prescriptions[index] = action.payload;
      }
      if (state.selectedPrescription?.id === action.payload.id) {
        state.selectedPrescription = action.payload;
      }
    },
    removePrescription: (state, action: PayloadAction<string>) => {
      state.prescriptions = state.prescriptions.filter(
        (p) => p.id !== action.payload,
      );
      state.pagination.total -= 1;
      if (state.selectedPrescription?.id === action.payload) {
        state.selectedPrescription = null;
      }
    },
    clearPrescriptions: (state) => {
      state.prescriptions = [];
      state.selectedPrescription = null;
      state.error = null;
    },
  },
});

export const {
  setPrescriptions,
  setSelectedPrescription,
  setLoading,
  setError,
  setPagination,
  setFilters,
  clearFilters,
  addPrescription,
  updatePrescription,
  removePrescription,
  clearPrescriptions,
} = prescriptionsSlice.actions;

export default prescriptionsSlice.reducer;
