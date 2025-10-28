// User related interfaces
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "admin" | "doctor" | "nurse" | "receptionist";
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  token?: string;
}

// Patient related interfaces
export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: "male" | "female" | "other";
  phone: string;
  email?: string;
  address?: string;
  emergencyContact?: string;
  medicalHistory?: string;
  allergies?: string;
  status: "active" | "inactive" | "discharged";
  createdAt: string;
  updatedAt: string;
}

export interface CreatePatientRequest {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: "male" | "female" | "other";
  phone: string;
  email?: string;
  address?: string;
  emergencyContact?: string;
  medicalHistory?: string;
  allergies?: string;
}

export interface UpdatePatientStatusRequest {
  status: "active" | "inactive" | "discharged";
}

export interface PatientsResponse {
  patients: Patient[];
  totalPages: number;
  currentPage: number;
  total: number;
}

// Medical Record interfaces
export interface MedicalRecord {
  id: string;
  patientId: string;
  doctorId: string;
  diagnosis: string;
  symptoms: string;
  treatment: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMedicalRecordRequest {
  patientId: string;
  doctorId: string;
  diagnosis: string;
  symptoms: string;
  treatment: string;
  notes?: string;
}

// Diagnosis interfaces
export interface Diagnosis {
  id: string;
  patientId: string;
  doctorId: string;
  condition: string;
  description: string;
  severity: "mild" | "moderate" | "severe";
  status: "active" | "resolved" | "chronic";
  createdAt: string;
  updatedAt: string;
}

export interface CreateDiagnosisRequest {
  patientId: string;
  doctorId: string;
  condition: string;
  description: string;
  severity: "mild" | "moderate" | "severe";
  status: "active" | "resolved" | "chronic";
}

export interface DiagnosesResponse {
  diagnoses: Diagnosis[];
  totalPages: number;
  currentPage: number;
  total: number;
}

// Appointment interfaces
export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  appointmentDate: string;
  appointmentTime: string;
  duration: number; // in minutes
  type: "consultation" | "follow-up" | "emergency" | "routine";
  status:
    | "scheduled"
    | "confirmed"
    | "in_progress"
    | "completed"
    | "cancelled"
    | "no_show";
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAppointmentRequest {
  patientId: string;
  doctorId: string;
  appointmentDate: string;
  appointmentTime: string;
  duration: number;
  type: "consultation" | "follow-up" | "emergency" | "routine";
  notes?: string;
}

export interface UpdateAppointmentStatusRequest {
  status:
    | "scheduled"
    | "confirmed"
    | "in_progress"
    | "completed"
    | "cancelled"
    | "no_show";
}

export interface AppointmentsResponse {
  appointments: Appointment[];
  totalPages: number;
  currentPage: number;
  total: number;
}

// Prescription interfaces
export interface PrescriptionItem {
  id: string;
  medicationName: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
  quantity: number;
}

export interface Prescription {
  id: string;
  patientId: string;
  doctorId: string;
  prescriptionDate: string;
  status: "pending" | "approved" | "dispensed" | "cancelled";
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePrescriptionRequest {
  patientId: string;
  doctorId: string;
  prescriptionDate: string;
  notes?: string;
  items: CreatePrescriptionItemRequest[];
}

export interface CreatePrescriptionItemRequest {
  medicationName: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
  quantity: number;
}

export interface UpdatePrescriptionStatusRequest {
  status: "pending" | "approved" | "dispensed" | "cancelled";
}

export interface PrescriptionsResponse {
  prescriptions: Prescription[];
  totalPages: number;
  currentPage: number;
  total: number;
}

export interface PrescriptionDetailResponse extends Prescription {
  items: PrescriptionItem[];
}

// Authentication interfaces
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterUserRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: "admin" | "doctor" | "nurse" | "receptionist";
}

export interface UpdatePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

// Statistics interfaces
export interface Stats {
  totalPatients: number;
  totalAppointments: number;
  totalPrescriptions: number;
  activeUsers: number;
  monthlyStats: {
    month: string;
    patients: number;
    appointments: number;
    prescriptions: number;
  }[];
}

// Activity Log interfaces
export interface ActivityLog {
  id: string;
  userId: string;
  action: string;
  entityType: string;
  entityId: string;
  details: string;
  timestamp: string;
}

export interface ActivityLogsResponse {
  logs: ActivityLog[];
  totalPages: number;
  currentPage: number;
  total: number;
}
