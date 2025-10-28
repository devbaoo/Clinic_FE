import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { BASE_URL } from "./apiConfig";

// Create axios instance
const axiosInstance: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor to handle common errors
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Clear stored auth data
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Redirect to login if not already there
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    // Handle 403 Forbidden
    if (error.response?.status === 403) {
      window.location.href = "/unauthorized";
    }

    return Promise.reject(error);
  },
);

// Generic API methods
export const apiClient = {
  get: <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> =>
    axiosInstance.get(url, config).then((response) => response.data),

  post: <T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<T> =>
    axiosInstance.post(url, data, config).then((response) => response.data),

  put: <T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<T> =>
    axiosInstance.put(url, data, config).then((response) => response.data),

  patch: <T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<T> =>
    axiosInstance.patch(url, data, config).then((response) => response.data),

  delete: <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> =>
    axiosInstance.delete(url, config).then((response) => response.data),
};

export default axiosInstance;
