import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

export const USERS_FILTER = {
  ALL: "All",
  ONLINE: "Online",
};

const initialState = {
  loading: false, // Initial loading state should be false
  isRequestLoading: false,
  usersFilter: USERS_FILTER.ALL, // Default filter
  allUsers: [],
};

// Define async thunk for fetching users
export const fetchUsers = createAsyncThunk(
  "global/fetchUsers",
  async (filter) => {
    let url = `${import.meta.env.VITE_API}/users`;
    if (filter === USERS_FILTER.ONLINE) {
      url = `${import.meta.env.VITE_API}/users/online`;
    }
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${Cookies.get("jwt")}`,
      },
    });
    return response.json();
  }
);

const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    loading: (state, action) => {
      state.loading = action.payload;
    },
    setRequestLoading: (state, action) => {
      state.isRequestLoading = action.payload;
    },
    setUsersFilter: (state, action) => {
      state.usersFilter = action.payload; // Use action.payload here
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.isRequestLoading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.isRequestLoading = false;
        state.allUsers = action.payload.data;
      })
      .addCase(fetchUsers.rejected, (state) => {
        state.isRequestLoading = false;
        // Handle error state or display error message
      });
  },
});

export const { loading, setRequestLoading, setUsersFilter } =
  globalSlice.actions;
export default globalSlice.reducer;
