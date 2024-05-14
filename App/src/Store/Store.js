import { configureStore } from '@reduxjs/toolkit';
import Auth from './Auth/index.js';
import Global from './Global/index.js';
import Chat from './Chat/index.js';
import chatForm from './Chat/chatForm.js';

export default configureStore({
    reducer: {
        auth: Auth,
        global: Global,
        chat: Chat,
        chatForm: chatForm
    }
});