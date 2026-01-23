import { configureStore } from '@reduxjs/toolkit';
import { chatReducer } from '../features/chat/chatSlice';
import { chatListener } from '../features/chat/chatListeners';

export const store = configureStore({
  reducer: {
    chat: chatReducer,
  },
  middleware: (getDefault) => getDefault().concat(chatListener.middleware), //getDefaultMiddleware
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
