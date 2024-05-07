import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isImageModalOpen: false,
  isFilesModalOpen: false,
};

const chatFormSlice = createSlice({
  name: "chatForm",
  initialState,
  reducers: {
    openImageModal: (state) => {
      state.isImageModalOpen = true;
    },
    closeImageModal: (state) => {
      state.isImageModalOpen = false;
    },
    openFilesModal: (state) => {
      state.isFilesModalOpen = true;
    },
    closeFilesModal: (state) => {
      state.isFilesModalOpen = false;
    },
  },
});

export const {
  openImageModal,
  closeImageModal,
  openFilesModal,
  closeFilesModal,
} = chatFormSlice.actions;
export default chatFormSlice.reducer;
