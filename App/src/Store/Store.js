import { configureStore } from '@reduxjs/toolkit';
import Auth from './Auth/index.js';
import Global from './Global/index.js';

export default configureStore({
    reducer: {
        auth: Auth,
        global: Global,
    }
});