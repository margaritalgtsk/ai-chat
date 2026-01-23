import {
  createSelector,
  createSlice,
  type PayloadAction,
} from '@reduxjs/toolkit';

import { v4 as uuidv4 } from 'uuid';
import type { ChatSession, Message } from '../../types';
import { loadChatHistory } from '../../storage';
import { sendMessageThunk } from './chatThunks';

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
    },
    selectSession: (state, action: PayloadAction<string>) => {
      state.activeSessionId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendMessageThunk.pending, (state, action) => {
        const session = state.sessions.find(
          (s) => s.id === action.meta.arg.sessionId
        );
        if (!session) return;
        session.status = 'streaming';
      })
      .addCase(sendMessageThunk.fulfilled, (state, action) => {
        const session = state.sessions.find(
          (s) => s.id === action.meta.arg.sessionId
        );
        if (!session) return;
        session.status = 'idle';
      })
      .addCase(sendMessageThunk.rejected, (state, action) => {
        const session = state.sessions.find(
          (s) => s.id === action.meta.arg.sessionId
        );
        if (!session) return;
        if (action.payload === 'aborted') {
          session.status = 'abort';
        } else {
          session.status = 'error';
        }
      });
  },
});

export const selectActiveSession = createSelector(
  (state: { chat: ChatState }) => state.chat.sessions,
  (state: { chat: ChatState }) => state.chat.activeSessionId,
  (sessions, activeSessionId) =>
    sessions.find((session) => session.id === activeSessionId)
);
export const { createNewChat, updateSessionMessages, selectSession } =
  chatSlice.actions;
export const chatReducer = chatSlice.reducer;
