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
    updateActiveSessionMessages: (state, action: PayloadAction<Message[]>) => {
      const updated = state.sessions.map((s) =>
        s.id === state.activeSessionId ? { ...s, messages: action.payload } : s
      );
      state.sessions = updated;
      saveChatHistory(state.sessions);
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
export const { createNewChat, updateActiveSessionMessages, selectSession } =
  chatSlice.actions;
export const chatReducer = chatSlice.reducer;
