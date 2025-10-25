import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "@shared/api";
import { RootState } from "../store";
import { apiSlice } from "../api/apiSlice";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

// Get user from localStorage
const storedUser = localStorage.getItem("user");
const storedToken = localStorage.getItem("token");

const initialState: AuthState = {
  user: storedUser ? JSON.parse(storedUser) : null,
  token: storedToken || null,
  isAuthenticated: !!storedToken,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; token: string }>,
    ) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;

      // Save to localStorage
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);
    },
    updateUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;

      // Update localStorage
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;

      // Remove from localStorage
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    },
  },
  // Add extra reducers to handle login success
  extraReducers: (builder) => {
    builder.addMatcher(
      apiSlice.endpoints.login.matchFulfilled,
      (state, { payload }) => {
        state.user = payload;
        state.token = payload.token || null;
        state.isAuthenticated = !!payload.token;

        // Save to localStorage
        localStorage.setItem("user", JSON.stringify(payload));
        if (payload.token) {
          localStorage.setItem("token", payload.token);
        }
      },
    );
  },
});

// Export actions
export const { setCredentials, updateUser, logout } = authSlice.actions;

// Export selectors
export const selectCurrentUser = (state: RootState) => state.auth.user;
export const selectToken = (state: RootState) => state.auth.token;
export const selectIsAuthenticated = (state: RootState) =>
  state.auth.isAuthenticated;

export default authSlice.reducer;
