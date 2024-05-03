import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loading: true,
};

const globalSlice = createSlice({
    name: 'global',
    initialState,
    reducers: {
        loading: (state, action) => {
            state.loading = action.payload;
        }
    }
});

export const { loading } = globalSlice.actions;
export default globalSlice.reducer;