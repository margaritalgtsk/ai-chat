import {
  createSelector,
  createSlice,
  type PayloadAction,
} from '@reduxjs/toolkit';
import type { ChatSession, Message } from '../types';
import { loadChatHistory, saveChatHistory } from '../storage';
import { v4 as uuidv4 } from 'uuid';

interface ChatState {
  sessions: ChatSession[];
  activeSessionId: string;
}

const initialState: ChatState = {
  sessions: loadChatHistory(),
  activeSessionId: loadChatHistory()[0]?.id || '',
};

export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    createNewChat: (state) => {
      const newSession = { id: uuidv4(), messages: [] };
      state.sessions.unshift(newSession);
      state.activeSessionId = newSession.id;
      saveChatHistory(state.sessions);
    },
    updateStatusSession: (
      state,
      action: PayloadAction<{
        sessionId: string;
        status: 'idle' | 'streaming' | 'error';
      }>
    ) => {
      const session = state.sessions.find(
        (s) => s.id === action.payload.sessionId
      );
      if (!session) return;
      session.status = action.payload.status;
      saveChatHistory(state.sessions); //side effect
    },
    updateSessionMessages: (
      state,
      action: PayloadAction<{ sessionId: string; messages: Message[] }>
    ) => {
      const session = state.sessions.find(
        (s) => s.id === action.payload.sessionId
      );
      if (!session) return;
      session.messages = action.payload.messages;
      saveChatHistory(state.sessions); //side effect - createAsyncThunk / middleware / listenerMiddleware
    },
    selectSession: (state, action: PayloadAction<string>) => {
      state.activeSessionId = action.payload;
    },
  },
});

export const selectActiveSession = createSelector(
  (state: { chat: ChatState }) => state.chat.sessions,
  (state: { chat: ChatState }) => state.chat.activeSessionId,
  (sessions, activeSessionId) =>
    sessions.find((session) => session.id === activeSessionId)
);
export const {
  createNewChat,
  updateSessionMessages,
  updateStatusSession,
  selectSession,
} = chatSlice.actions;
export const chatReducer = chatSlice.reducer;
