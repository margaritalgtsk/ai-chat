import { configureStore } from '@reduxjs/toolkit';
import { chatReducer } from '../features/chat/chatSlice';
import { chatListener } from '../features/chat/chatListeners';
import { authReducer } from '../features/auth/authSlice';

export const store = configureStore({
  reducer: {
    chat: chatReducer,
    auth: authReducer,
  },
  middleware: (getDefault) => getDefault().concat(chatListener.middleware), //getDefaultMiddleware
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
