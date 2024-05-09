import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

export const USERS_FILTER = {
  MESSAGES: "Messages",
  USERS: "Users",
};

const initialState = {
  isUsersFetching: false,
  isConversationsFetching: false,
  usersFilter: USERS_FILTER.MESSAGES, // Default filter
  users: [],
  conversations: [],
};

// Define async thunk for fetching users
export const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
  let url = `${import.meta.env.VITE_API}/users`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${Cookies.get("jwt")}`,
    },
  });
  return response.json();
});

export const fetchConversations = createAsyncThunk(
  "users/fetchConversations",
  async () => {
    let url = `${import.meta.env.VITE_API}/conversations`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${Cookies.get("jwt")}`,
      },
    });
    return response.json();
  }
);

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    isUsersFetching: (state, action) => {
      state.isUsersFetching = action.payload;
    },
    isConversationsFetching: (state, action) => {
      state.isConversationsFetching = action.payload;
    },
    setUsersFilter: (state, action) => {
      state.usersFilter = action.payload; // Use action.payload here
    },
    updateLastMessage: (state, action) => {
      const { conversationId, message } = action.payload;
      const conversation = state.conversations.find(
        (conversation) => conversation._id === conversationId
      );
      conversation.last_message = message;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.isUsersFetching = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.isUsersFetching = false;
        state.users = action.payload.data;
      })
      .addCase(fetchUsers.rejected, (state) => {
        state.isUsersFetching = false;
        toast.error("Failed to fetch users");
      })
      .addCase(fetchConversations.pending, (state) => {
        state.isConversationsFetching = true;
      })
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.isConversationsFetching = false;
        state.conversations = action.payload.data.conversations;
      })
      .addCase(fetchConversations.rejected, (state) => {
        state.isConversationsFetching = false;
        toast.error("Failed to fetch conversations");
      });
  },
});

export const {
  isUsersFetching,
  isConversationsFetching,
  setUsersFilter,
  updateLastMessage,
} = usersSlice.actions;
export default usersSlice.reducer;
