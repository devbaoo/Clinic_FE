import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "@shared/api";

interface UsersState {
  users: User[];
  selectedUser: User | null;
  loading: boolean;
  error: string | null;
  pagination: {
    currentPage: number;
    totalPages: number;
    total: number;
    limit: number;
  };
  filters: {
    role?: string;
    status?: string;
  };
}

const initialState: UsersState = {
  users: [],
  selectedUser: null,
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

export const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setUsers: (state, action: PayloadAction<User[]>) => {
      state.users = action.payload;
    },
    setSelectedUser: (state, action: PayloadAction<User | null>) => {
      state.selectedUser = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setPagination: (state, action: PayloadAction<UsersState["pagination"]>) => {
      state.pagination = action.payload;
    },
    setFilters: (state, action: PayloadAction<UsersState["filters"]>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    addUser: (state, action: PayloadAction<User>) => {
      state.users.unshift(action.payload);
      state.pagination.total += 1;
    },
    updateUser: (state, action: PayloadAction<User>) => {
      const index = state.users.findIndex((u) => u.id === action.payload.id);
      if (index !== -1) {
        state.users[index] = action.payload;
      }
      if (state.selectedUser?.id === action.payload.id) {
        state.selectedUser = action.payload;
      }
    },
    removeUser: (state, action: PayloadAction<string>) => {
      state.users = state.users.filter((u) => u.id !== action.payload);
      state.pagination.total -= 1;
      if (state.selectedUser?.id === action.payload) {
        state.selectedUser = null;
      }
    },
    clearUsers: (state) => {
      state.users = [];
      state.selectedUser = null;
      state.error = null;
    },
  },
});

export const {
  setUsers,
  setSelectedUser,
  setLoading,
  setError,
  setPagination,
  setFilters,
  clearFilters,
  addUser,
  updateUser,
  removeUser,
  clearUsers,
} = usersSlice.actions;

export default usersSlice.reducer;
