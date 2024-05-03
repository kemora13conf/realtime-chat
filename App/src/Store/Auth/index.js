import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isAuthenticated: false,
    user: null,
    loading: false,
    errors: null
};

const authSlice = createSlice({
    name: 'auth',
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
        }
    }
});

export const { loading, errors, login, logout } = authSlice.actions;
export default authSlice.reducer;