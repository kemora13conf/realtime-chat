import { createSlice } from "@reduxjs/toolkit";
import Cookies from 'js-cookie';
import { toast } from "react-toastify";

const initialState = {
  isAuthenticated: false,
  user: null,
  loading: false,
  errors: null,
  registration: {
    step: 1,
    data: {
      username: "",
      email: "",
      password: "",
      confirm_password: "",
      image: null,
    },
  },
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loading: (state, action) => {
      state.loading = action.payload;
    },
    errors: (state, action) => {
      state.errors = action.payload;
    },
    login: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      Cookies.remove('jwt');
      toast.success("Logged out successfully", {theme:'dark'});
    },
    setRegistrationStep: (state, action) => {
      state.registration.step = action.payload;
    },
    setRegistrationData: (state, action) => {
      state.registration.data = {
        ...state.registration.data,
        ...action.payload,
      };
    },
  },
});

export const {
  loading,
  errors,
  login,
  logout,
  setRegistrationStep,
  setRegistrationData,
} = authSlice.actions;
export default authSlice.reducer;
