import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type {
  LoginRequest,
  User,
  Patient,
  PatientsResponse,
  MedicalRecord,
  Diagnosis,
  DiagnosesResponse,
  Appointment,
  AppointmentsResponse,
  Prescription,
  PrescriptionsResponse,
  PrescriptionDetailResponse,
  Stats,
  ActivityLogsResponse,
  CreatePatientRequest,
  UpdatePatientStatusRequest,
  CreateMedicalRecordRequest,
  CreateDiagnosisRequest,
  CreateAppointmentRequest,
  UpdateAppointmentStatusRequest,
  CreatePrescriptionRequest,
  UpdatePrescriptionStatusRequest,
  CreatePrescriptionItemRequest,
  RegisterUserRequest,
  UpdatePasswordRequest,
} from "@shared/api";

// Hardcoded mock data
const mockUsers: User[] = [
  {
    id: "1",
    email: "admin@clinic.com",
    firstName: "Admin",
    lastName: "User",
    role: "admin",
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "2",
    email: "doctor@clinic.com",
    firstName: "Dr. John",
    lastName: "Smith",
    role: "doctor",
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
];

const mockPatients: Patient[] = [
  {
    id: "1",
    firstName: "Jane",
    lastName: "Doe",
    dateOfBirth: "1990-01-01",
    gender: "female",
    phone: "123-456-7890",
    email: "jane.doe@email.com",
    address: "123 Main St",
    emergencyContact: "John Doe - 098-765-4321",
    medicalHistory: "No significant medical history",
    allergies: "None",
    status: "active",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "2",
    firstName: "Bob",
    lastName: "Johnson",
    dateOfBirth: "1985-05-15",
    gender: "male",
    phone: "234-567-8901",
    email: "bob.johnson@email.com",
    address: "456 Oak Ave",
    emergencyContact: "Mary Johnson - 987-654-3210",
    medicalHistory: "Diabetes Type 2",
    allergies: "Penicillin",
    status: "active",
    createdAt: "2024-01-02T00:00:00Z",
    updatedAt: "2024-01-02T00:00:00Z",
  },
];

const mockAppointments: Appointment[] = [
  {
    id: "1",
    patientId: "1",
    doctorId: "2",
    appointmentDate: "2024-01-15",
    appointmentTime: "09:00",
    duration: 30,
    type: "consultation",
    status: "scheduled",
    notes: "Regular checkup",
    createdAt: "2024-01-10T00:00:00Z",
    updatedAt: "2024-01-10T00:00:00Z",
  },
  {
    id: "2",
    patientId: "2",
    doctorId: "2",
    appointmentDate: "2024-01-16",
    appointmentTime: "10:30",
    duration: 45,
    type: "follow-up",
    status: "confirmed",
    notes: "Follow-up for diabetes management",
    createdAt: "2024-01-11T00:00:00Z",
    updatedAt: "2024-01-11T00:00:00Z",
  },
];

const mockPrescriptions: Prescription[] = [
  {
    id: "1",
    patientId: "2",
    doctorId: "2",
    prescriptionDate: "2024-01-12",
    status: "approved",
    notes: "Diabetes medication",
    createdAt: "2024-01-12T00:00:00Z",
    updatedAt: "2024-01-12T00:00:00Z",
  },
];

const mockStats: Stats = {
  totalPatients: 2,
  totalAppointments: 2,
  totalPrescriptions: 1,
  activeUsers: 2,
  monthlyStats: [
    {
      month: "January 2024",
      patients: 2,
      appointments: 2,
      prescriptions: 1,
    },
  ],
};

// Mock API slice with hardcoded data
export const apiSlice = createSlice({
  name: "api",
  initialState: {
    users: mockUsers,
    patients: mockPatients,
    appointments: mockAppointments,
    prescriptions: mockPrescriptions,
    stats: mockStats,
    loading: false,
    error: null as string | null,
  },
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    // Mock login action
    loginSuccess: (state, action: PayloadAction<User>) => {
      // In a real app, this would be handled by authSlice
      state.loading = false;
      state.error = null;
    },
    // Mock CRUD operations for patients
    addPatient: (state, action: PayloadAction<Patient>) => {
      state.patients.push(action.payload);
    },
    updatePatient: (state, action: PayloadAction<Patient>) => {
      const index = state.patients.findIndex((p) => p.id === action.payload.id);
      if (index !== -1) {
        state.patients[index] = action.payload;
      }
    },
    deletePatient: (state, action: PayloadAction<string>) => {
      state.patients = state.patients.filter((p) => p.id !== action.payload);
    },
    // Mock CRUD operations for appointments
    addAppointment: (state, action: PayloadAction<Appointment>) => {
      state.appointments.push(action.payload);
    },
    updateAppointment: (state, action: PayloadAction<Appointment>) => {
      const index = state.appointments.findIndex(
        (a) => a.id === action.payload.id,
      );
      if (index !== -1) {
        state.appointments[index] = action.payload;
      }
    },
    deleteAppointment: (state, action: PayloadAction<string>) => {
      state.appointments = state.appointments.filter(
        (a) => a.id !== action.payload,
      );
    },
    // Mock CRUD operations for prescriptions
    addPrescription: (state, action: PayloadAction<Prescription>) => {
      state.prescriptions.push(action.payload);
    },
    updatePrescription: (state, action: PayloadAction<Prescription>) => {
      const index = state.prescriptions.findIndex(
        (p) => p.id === action.payload.id,
      );
      if (index !== -1) {
        state.prescriptions[index] = action.payload;
      }
    },
    deletePrescription: (state, action: PayloadAction<string>) => {
      state.prescriptions = state.prescriptions.filter(
        (p) => p.id !== action.payload,
      );
    },
  },
});

export const {
  setLoading,
  setError,
  loginSuccess,
  addPatient,
  updatePatient,
  deletePatient,
  addAppointment,
  updateAppointment,
  deleteAppointment,
  addPrescription,
  updatePrescription,
  deletePrescription,
} = apiSlice.actions;

// Mock selectors
export const selectUsers = (state: any) => state.api.users;
export const selectPatients = (state: any) => state.api.patients;
export const selectAppointments = (state: any) => state.api.appointments;
export const selectPrescriptions = (state: any) => state.api.prescriptions;
export const selectStats = (state: any) => state.api.stats;
export const selectLoading = (state: any) => state.api.loading;
export const selectError = (state: any) => state.api.error;

export default apiSlice.reducer;
