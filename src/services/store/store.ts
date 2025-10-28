import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "@reduxjs/toolkit";
import apiReducer from "../features/apiSlice";
import authReducer from "../features/auth/authSlice";
import patientsReducer from "../features/patients/patientsSlice";
import appointmentsReducer from "../features/appointments/appointmentsSlice";
import prescriptionsReducer from "../features/prescriptions/prescriptionsSlice";
import usersReducer from "../features/users/usersSlice";
import { useSelector, useDispatch, TypedUseSelectorHook } from "react-redux";

const presistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"], // Only persist auth state
};

const rootReducer = combineReducers({
  api: apiReducer,
  auth: authReducer,
  patients: patientsReducer,
  appointments: appointmentsReducer,
  prescriptions: prescriptionsReducer,
  users: usersReducer,
});

const persistedReducer = persistReducer(presistConfig, rootReducer);

// Combine all reducers
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// Persist the store
export const persistor = persistStore(store);

// Export types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Export hooks for using TypedUseSelectorHook
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
