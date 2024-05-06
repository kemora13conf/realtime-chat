import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import Cookies  from "js-cookie";

export const USER_STATUS = {
  ONLINE: "online",
  OFFLINE: "offline",
};

const initialState = {
  isChatOpen: false,
  isMessagesFetching: false,
  openedChat: {
    user: null,
    messages: [],
  },
};

export const fetchMessages = createAsyncThunk(
  "chat/fetchMessages",
  async (id) => {
    const response = await fetch(
      `${import.meta.env.VITE_API}/conversations/${id}/messages`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${Cookies.get("jwt")}`
        },
      }
    );
    return response.json();
  }
);

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    openChat: (state, action) => {
      state.isChatOpen = true;
      state.openedChat.user = action.payload;
    },
    closeChat: (state) => {
      state.isChatOpen = false;
      state.openedChat = {
        user: null,
        messages: [],
      };
    },
    isMessagesFetching: (state, action) => {
      state.isMessagesFetching = action.payload;
    },
    AddMessage: (state, action) => {
      // check if the message already exists
      const message = state.openedChat.messages.find(
        (msg) => msg._id === action.payload._id
      );
      if (!message) {
        state.openedChat.messages.push(action.payload);
      }
    },
    setUserStatus: (state, action) => {
      state.openedChat.user.status = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMessages.pending, (state) => {
        state.isMessagesFetching = true;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.isMessagesFetching = false;
        state.openedChat.messages = action.payload.data;
      })
      .addCase(fetchMessages.rejected, (state) => {
        state.isMessagesFetching = false;
        toast.error("Failed to fetch messages");
      });
  },
});

export const { openChat, closeChat, isMessagesFetching, AddMessage, setUserStatus } =
  chatSlice.actions;
export default chatSlice.reducer;
