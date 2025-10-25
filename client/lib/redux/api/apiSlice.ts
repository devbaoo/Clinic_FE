import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
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

// Define a service using a base URL and expected endpoints
export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000",
    prepareHeaders: (headers) => {
      // Get the token from localStorage
      const token = localStorage.getItem("token");
      // If we have a token, add it to the headers
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: [
    "User",
    "Patient",
    "MedicalRecord",
    "Diagnosis",
    "Appointment",
    "Prescription",
    "Stats",
    "ActivityLog",
  ],
  endpoints: (builder) => ({
    // Authentication
    login: builder.mutation<User, LoginRequest>({
      query: (credentials) => ({
        url: "/api/users/login",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["User"],
    }),

    // User Management
    registerUser: builder.mutation<User, RegisterUserRequest>({
      query: (userData) => ({
        url: "/api/users/register",
        method: "POST",
        body: userData,
      }),
      invalidatesTags: ["User"],
    }),

    getUsers: builder.query<
      { users: User[]; totalPages: number; currentPage: number; total: number },
      { page?: number; limit?: number; role?: string }
    >({
      query: ({ page = 1, limit = 10, role }) => {
        let url = `/api/users?page=${page}&limit=${limit}`;
        if (role) url += `&role=${role}`;
        return url;
      },
      providesTags: ["User"],
    }),

    getDoctors: builder.query<User[], void>({
      query: () => "/api/users/doctors",
      providesTags: ["User"],
    }),

    getUserById: builder.query<User, string>({
      query: (id) => `/api/users/${id}`,
      providesTags: (result, error, id) => [{ type: "User", id }],
    }),

    getUserProfile: builder.query<User, void>({
      query: () => "/api/users/profile",
      providesTags: ["User"],
    }),

    updateUser: builder.mutation<
      User,
      { id: string; userData: Partial<RegisterUserRequest> }
    >({
      query: ({ id, userData }) => ({
        url: `/api/users/${id}`,
        method: "PUT",
        body: userData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "User", id },
        "User",
      ],
    }),

    updatePassword: builder.mutation<
      { message: string },
      { id: string; passwordData: UpdatePasswordRequest }
    >({
      query: ({ id, passwordData }) => ({
        url: `/api/users/${id}/password`,
        method: "PATCH",
        body: passwordData,
      }),
    }),

    deleteUser: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/api/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),

    // Patient Management
    getPatients: builder.query<
      PatientsResponse,
      { page?: number; limit?: number; status?: string }
    >({
      query: ({ page = 1, limit = 10, status }) => {
        let url = `/api/patients?page=${page}&limit=${limit}`;
        if (status) url += `&status=${status}`;
        return url;
      },
      providesTags: ["Patient"],
    }),

    searchPatients: builder.query<
      PatientsResponse,
      { q: string; page?: number; limit?: number }
    >({
      query: ({ q, page = 1, limit = 10 }) =>
        `/api/patients/search?q=${q}&page=${page}&limit=${limit}`,
      providesTags: ["Patient"],
    }),

    getPatientById: builder.query<Patient, string>({
      query: (id) => `/api/patients/${id}`,
      providesTags: (result, error, id) => [{ type: "Patient", id }],
    }),

    createPatient: builder.mutation<Patient, CreatePatientRequest>({
      query: (patientData) => ({
        url: "/api/patients",
        method: "POST",
        body: patientData,
      }),
      invalidatesTags: ["Patient"],
    }),

    updatePatient: builder.mutation<
      Patient,
      { id: string; patientData: Partial<CreatePatientRequest> }
    >({
      query: ({ id, patientData }) => ({
        url: `/api/patients/${id}`,
        method: "PUT",
        body: patientData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Patient", id },
        "Patient",
      ],
    }),

    updatePatientStatus: builder.mutation<
      Patient,
      { id: string; statusData: UpdatePatientStatusRequest }
    >({
      query: ({ id, statusData }) => ({
        url: `/api/patients/${id}/status`,
        method: "PATCH",
        body: statusData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Patient", id },
        "Patient",
      ],
    }),

    deletePatient: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/api/patients/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Patient"],
    }),

    // Medical Records
    getMedicalRecordByPatientId: builder.query<MedicalRecord, string>({
      query: (patientId) => `/api/medical-records/patient/${patientId}`,
      providesTags: (result, error, patientId) => [
        { type: "MedicalRecord", id: patientId },
      ],
    }),

    getMedicalRecordById: builder.query<MedicalRecord, string>({
      query: (id) => `/api/medical-records/${id}`,
      providesTags: (result, error, id) => [{ type: "MedicalRecord", id }],
    }),

    createMedicalRecord: builder.mutation<
      MedicalRecord,
      CreateMedicalRecordRequest
    >({
      query: (recordData) => ({
        url: "/api/medical-records",
        method: "POST",
        body: recordData,
      }),
      invalidatesTags: (result) =>
        result
          ? [{ type: "MedicalRecord", id: result.patientId }, "MedicalRecord"]
          : ["MedicalRecord"],
    }),

    updateMedicalRecord: builder.mutation<
      MedicalRecord,
      { id: string; recordData: Partial<CreateMedicalRecordRequest> }
    >({
      query: ({ id, recordData }) => ({
        url: `/api/medical-records/${id}`,
        method: "PUT",
        body: recordData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "MedicalRecord", id },
        "MedicalRecord",
      ],
    }),

    deleteMedicalRecord: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/api/medical-records/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["MedicalRecord"],
    }),

    // Diagnoses
    getDiagnosesByPatientId: builder.query<
      DiagnosesResponse,
      { patientId: string; page?: number; limit?: number }
    >({
      query: ({ patientId, page = 1, limit = 10 }) =>
        `/api/diagnoses/patient/${patientId}?page=${page}&limit=${limit}`,
      providesTags: (result, error, { patientId }) => [
        { type: "Diagnosis", id: patientId },
        "Diagnosis",
      ],
    }),

    getDiagnosisById: builder.query<Diagnosis, string>({
      query: (id) => `/api/diagnoses/${id}`,
      providesTags: (result, error, id) => [{ type: "Diagnosis", id }],
    }),

    createDiagnosis: builder.mutation<Diagnosis, CreateDiagnosisRequest>({
      query: (diagnosisData) => ({
        url: "/api/diagnoses",
        method: "POST",
        body: diagnosisData,
      }),
      invalidatesTags: (result) =>
        result
          ? [{ type: "Diagnosis", id: result.patientId }, "Diagnosis"]
          : ["Diagnosis"],
    }),

    updateDiagnosis: builder.mutation<
      Diagnosis,
      { id: string; diagnosisData: Partial<CreateDiagnosisRequest> }
    >({
      query: ({ id, diagnosisData }) => ({
        url: `/api/diagnoses/${id}`,
        method: "PUT",
        body: diagnosisData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Diagnosis", id },
        "Diagnosis",
      ],
    }),

    deleteDiagnosis: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/api/diagnoses/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Diagnosis"],
    }),

    // Appointments
    getAppointments: builder.query<
      AppointmentsResponse,
      { page?: number; limit?: number; status?: string }
    >({
      query: ({ page = 1, limit = 10, status }) => {
        let url = `/api/appointments?page=${page}&limit=${limit}`;
        if (status) url += `&status=${status}`;
        return url;
      },
      providesTags: ["Appointment"],
    }),

    getAppointmentsByDate: builder.query<
      AppointmentsResponse,
      { date: string; page?: number; limit?: number }
    >({
      query: ({ date, page = 1, limit = 10 }) =>
        `/api/appointments/date/${date}?page=${page}&limit=${limit}`,
      providesTags: ["Appointment"],
    }),

    getAppointmentsByPatientId: builder.query<
      AppointmentsResponse,
      { patientId: string; page?: number; limit?: number }
    >({
      query: ({ patientId, page = 1, limit = 10 }) =>
        `/api/appointments/patient/${patientId}?page=${page}&limit=${limit}`,
      providesTags: (result, error, { patientId }) => [
        { type: "Appointment", id: patientId },
        "Appointment",
      ],
    }),

    getAppointmentsByDoctorId: builder.query<
      AppointmentsResponse,
      { doctorId: string; page?: number; limit?: number }
    >({
      query: ({ doctorId, page = 1, limit = 10 }) =>
        `/api/appointments/doctor/${doctorId}?page=${page}&limit=${limit}`,
      providesTags: (result, error, { doctorId }) => [
        { type: "Appointment", id: doctorId },
        "Appointment",
      ],
    }),

    getAppointmentById: builder.query<Appointment, string>({
      query: (id) => `/api/appointments/${id}`,
      providesTags: (result, error, id) => [{ type: "Appointment", id }],
    }),

    createAppointment: builder.mutation<Appointment, CreateAppointmentRequest>({
      query: (appointmentData) => ({
        url: "/api/appointments",
        method: "POST",
        body: appointmentData,
      }),
      invalidatesTags: ["Appointment"],
    }),

    updateAppointment: builder.mutation<
      Appointment,
      { id: string; appointmentData: Partial<CreateAppointmentRequest> }
    >({
      query: ({ id, appointmentData }) => ({
        url: `/api/appointments/${id}`,
        method: "PUT",
        body: appointmentData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Appointment", id },
        "Appointment",
      ],
    }),

    updateAppointmentStatus: builder.mutation<
      Appointment,
      { id: string; statusData: UpdateAppointmentStatusRequest }
    >({
      query: ({ id, statusData }) => ({
        url: `/api/appointments/${id}/status`,
        method: "PATCH",
        body: statusData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Appointment", id },
        "Appointment",
      ],
    }),

    deleteAppointment: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/api/appointments/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Appointment"],
    }),

    // Prescriptions
    getPrescriptions: builder.query<
      PrescriptionsResponse,
      { page?: number; limit?: number; status?: string }
    >({
      query: ({ page = 1, limit = 10, status }) => {
        let url = `/api/prescriptions?page=${page}&limit=${limit}`;
        if (status) url += `&status=${status}`;
        return url;
      },
      providesTags: ["Prescription"],
    }),

    getPrescriptionsByPatientId: builder.query<
      PrescriptionsResponse,
      { patientId: string; page?: number; limit?: number }
    >({
      query: ({ patientId, page = 1, limit = 10 }) =>
        `/api/prescriptions/patient/${patientId}?page=${page}&limit=${limit}`,
      providesTags: (result, error, { patientId }) => [
        { type: "Prescription", id: patientId },
        "Prescription",
      ],
    }),

    getPrescriptionById: builder.query<PrescriptionDetailResponse, string>({
      query: (id) => `/api/prescriptions/${id}`,
      providesTags: (result, error, id) => [{ type: "Prescription", id }],
    }),

    createPrescription: builder.mutation<
      PrescriptionDetailResponse,
      CreatePrescriptionRequest
    >({
      query: (prescriptionData) => ({
        url: "/api/prescriptions",
        method: "POST",
        body: prescriptionData,
      }),
      invalidatesTags: ["Prescription"],
    }),

    updatePrescription: builder.mutation<
      Prescription,
      {
        id: string;
        prescriptionData: Partial<Omit<CreatePrescriptionRequest, "items">>;
      }
    >({
      query: ({ id, prescriptionData }) => ({
        url: `/api/prescriptions/${id}`,
        method: "PUT",
        body: prescriptionData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Prescription", id },
        "Prescription",
      ],
    }),

    updatePrescriptionStatus: builder.mutation<
      Prescription,
      { id: string; statusData: UpdatePrescriptionStatusRequest }
    >({
      query: ({ id, statusData }) => ({
        url: `/api/prescriptions/${id}/status`,
        method: "PATCH",
        body: statusData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Prescription", id },
        "Prescription",
      ],
    }),

    deletePrescription: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/api/prescriptions/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Prescription"],
    }),

    addPrescriptionItem: builder.mutation<
      PrescriptionDetailResponse["items"][0],
      { prescriptionId: string; itemData: CreatePrescriptionItemRequest }
    >({
      query: ({ prescriptionId, itemData }) => ({
        url: `/api/prescriptions/${prescriptionId}/items`,
        method: "POST",
        body: itemData,
      }),
      invalidatesTags: (result, error, { prescriptionId }) => [
        { type: "Prescription", id: prescriptionId },
      ],
    }),

    updatePrescriptionItem: builder.mutation<
      PrescriptionDetailResponse["items"][0],
      { itemId: string; itemData: Partial<CreatePrescriptionItemRequest> }
    >({
      query: ({ itemId, itemData }) => ({
        url: `/api/prescriptions/items/${itemId}`,
        method: "PUT",
        body: itemData,
      }),
      invalidatesTags: ["Prescription"],
    }),

    deletePrescriptionItem: builder.mutation<{ message: string }, string>({
      query: (itemId) => ({
        url: `/api/prescriptions/items/${itemId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Prescription"],
    }),

    // Statistics
    getLatestStats: builder.query<Stats, void>({
      query: () => "/api/stats/latest",
      providesTags: ["Stats"],
    }),

    generateStats: builder.mutation<Stats, void>({
      query: () => ({
        url: "/api/stats/generate",
        method: "POST",
      }),
      invalidatesTags: ["Stats"],
    }),

    // Activity Logs
    getActivityLogs: builder.query<
      ActivityLogsResponse,
      { page?: number; limit?: number }
    >({
      query: ({ page = 1, limit = 10 }) =>
        `/api/activity-logs?page=${page}&limit=${limit}`,
      providesTags: ["ActivityLog"],
    }),

    getActivityLogsByUserId: builder.query<
      ActivityLogsResponse,
      { userId: string; page?: number; limit?: number }
    >({
      query: ({ userId, page = 1, limit = 10 }) =>
        `/api/activity-logs/user/${userId}?page=${page}&limit=${limit}`,
      providesTags: (result, error, { userId }) => [
        { type: "ActivityLog", id: userId },
        "ActivityLog",
      ],
    }),

    getActivityLogsByEntity: builder.query<
      ActivityLogsResponse,
      { entityType: string; entityId: string; page?: number; limit?: number }
    >({
      query: ({ entityType, entityId, page = 1, limit = 10 }) =>
        `/api/activity-logs/entity/${entityType}/${entityId}?page=${page}&limit=${limit}`,
      providesTags: ["ActivityLog"],
    }),
  }),
});

// Export hooks for usage in components
export const {
  // Authentication
  useLoginMutation,

  // User Management
  useRegisterUserMutation,
  useGetUsersQuery,
  useGetDoctorsQuery,
  useGetUserByIdQuery,
  useGetUserProfileQuery,
  useUpdateUserMutation,
  useUpdatePasswordMutation,
  useDeleteUserMutation,

  // Patient Management
  useGetPatientsQuery,
  useSearchPatientsQuery,
  useGetPatientByIdQuery,
  useCreatePatientMutation,
  useUpdatePatientMutation,
  useUpdatePatientStatusMutation,
  useDeletePatientMutation,

  // Medical Records
  useGetMedicalRecordByPatientIdQuery,
  useGetMedicalRecordByIdQuery,
  useCreateMedicalRecordMutation,
  useUpdateMedicalRecordMutation,
  useDeleteMedicalRecordMutation,

  // Diagnoses
  useGetDiagnosesByPatientIdQuery,
  useGetDiagnosisByIdQuery,
  useCreateDiagnosisMutation,
  useUpdateDiagnosisMutation,
  useDeleteDiagnosisMutation,

  // Appointments
  useGetAppointmentsQuery,
  useGetAppointmentsByDateQuery,
  useGetAppointmentsByPatientIdQuery,
  useGetAppointmentsByDoctorIdQuery,
  useGetAppointmentByIdQuery,
  useCreateAppointmentMutation,
  useUpdateAppointmentMutation,
  useUpdateAppointmentStatusMutation,
  useDeleteAppointmentMutation,

  // Prescriptions
  useGetPrescriptionsQuery,
  useGetPrescriptionsByPatientIdQuery,
  useGetPrescriptionByIdQuery,
  useCreatePrescriptionMutation,
  useUpdatePrescriptionMutation,
  useUpdatePrescriptionStatusMutation,
  useDeletePrescriptionMutation,
  useAddPrescriptionItemMutation,
  useUpdatePrescriptionItemMutation,
  useDeletePrescriptionItemMutation,

  // Statistics
  useGetLatestStatsQuery,
  useGenerateStatsMutation,

  // Activity Logs
  useGetActivityLogsQuery,
  useGetActivityLogsByUserIdQuery,
  useGetActivityLogsByEntityQuery,
} = apiSlice;
