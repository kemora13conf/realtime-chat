import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  openedImage: null,
};

const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    loading: (state, action) => {
      state.loading = action.payload;
    },
    openImage: (state, action) => {
      if (action.payload) {
        state.openedImage = action.payload;
      }
    },
    closeImage: (state) => {
      state.openedImage = null;
    },
  },
});

export const {
  loading,
  openImage,
  closeImage,
} = globalSlice.actions;
export default globalSlice.reducer;
