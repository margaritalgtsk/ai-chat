import {
  createSelector,
  createSlice,
  type PayloadAction,
} from '@reduxjs/toolkit';

import { v4 as uuidv4 } from 'uuid';
import type { ChatErrorType, ChatSession, Message } from '../../types';
import { loadChatHistory } from '../../storage';
import { sendMessageThunk } from './chatThunks';
import type { AgentUpdate } from '../../agent/types';

interface ChatState {
  sessions: ChatSession[];
  activeSessionId: string;
}

const initialState: ChatState = {
  sessions: [{ id: 'default', messages: [] }],
  activeSessionId: 'default',
};

export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    loadHistory: (state) => {
      state.sessions = loadChatHistory();
      state.activeSessionId = state.sessions[0]?.id || '';
    },
    createNewChat: (state) => {
      const newSession = { id: uuidv4(), messages: [] };
      state.sessions.unshift(newSession);
      state.activeSessionId = newSession.id;
    },
    setSessionTitle: (
      state,
      action: PayloadAction<{ sessionId: string; title: string }>
    ) => {
      const session = state.sessions.find(
        (s) => s.id === action.payload.sessionId
      );
      if (session) {
        session.title = action.payload.title;
      }
    },
    selectSession: (state, action: PayloadAction<string>) => {
      state.activeSessionId = action.payload;
    },
    deleteSession: (state, action: PayloadAction<string>) => {
      state.sessions = state.sessions.filter((s) => s.id !== action.payload);
      if (state.activeSessionId === action.payload) {
        state.activeSessionId = state.sessions[0]?.id || '';
      }
    },
    addMessages: (
      state,
      action: PayloadAction<{ sessionId: string; messages: Message[] }>
    ) => {
      const session = state.sessions.find(
        (s) => s.id === action.payload.sessionId
      );
      if (!session) return;
      session.messages = [...session.messages, ...action.payload.messages];
    },
    updateAssistantMessage: (
      state,
      action: PayloadAction<{
        sessionId: string;
        messageId?: string;
        content: string;
      }>
    ) => {
      const session = state.sessions.find(
        (s) => s.id === action.payload.sessionId
      );
      if (!session) return;
      const message = session.messages.find(
        (m) => m.id === action.payload.messageId
      );
      if (!message || message.role !== 'assistant') return;
      message.content = action.payload.content;
      message.status = 'streaming';
    },
    addAgentUpdate: (
      state,
      action: PayloadAction<{
        sessionId: string;
        messageId: string;
        update: AgentUpdate;
      }>
    ) => {
      const session = state.sessions.find(
        (s) => s.id === action.payload.sessionId
      );
      if (!session) return;
      const message = session.messages.find(
        (m) => m.id === action.payload.messageId
      );
      if (!message || message.role !== 'assistant') return;
      message.agentUpdates = action.payload.update;
    },
    finalizeAssistantMessage: (
      state,
      action: PayloadAction<{ sessionId: string; messageId: string }>
    ) => {
      const session = state.sessions.find(
        (s) => s.id === action.payload.sessionId
      );
      if (!session) return;
      const message = session.messages.find(
        (m) => m.id === action.payload.messageId
      );
      if (!message || message.role !== 'assistant') return;
      message.status = 'idle';
      message.errorType = undefined;
    },
    setAssistantMessageRetry: (
      state,
      action: PayloadAction<{
        sessionId: string;
        messageId?: string;
        attempt: number;
        max: number;
      }>
    ) => {
      const session = state.sessions.find(
        (s) => s.id === action.payload.sessionId
      );
      if (!session) return;
      const message = action.payload.messageId
        ? session.messages.find((m) => m.id === action.payload.messageId)
        : [...session.messages].reverse().find((m) => m.role === 'assistant');

      if (!message || message.role !== 'assistant') return;
      message.status = 'retrying';
      message.retry = {
        attempt: action.payload.attempt,
        max: action.payload.max,
      };
    },
    markAssistantMessageAborted: (
      state,
      action: PayloadAction<{ sessionId: string; messageId?: string }>
    ) => {
      const session = state.sessions.find(
        (s) => s.id === action.payload.sessionId
      );
      if (!session) return;

      const message = action.payload.messageId
        ? session.messages.find((m) => m.id === action.payload.messageId)
        : [...session.messages].reverse().find((m) => m.role === 'assistant');

      if (!message || message.role !== 'assistant') return;
      message.status = 'abort';
    },
    markAssistantMessageError: (
      state,
      action: PayloadAction<{
        sessionId: string;
        messageId?: string;
        errorType: ChatErrorType;
      }>
    ) => {
      const session = state.sessions.find(
        (s) => s.id === action.payload.sessionId
      );
      if (!session) return;

      const message = action.payload.messageId
        ? session.messages.find((m) => m.id === action.payload.messageId)
        : [...session.messages].reverse().find((m) => m.role === 'assistant');

      if (!message || message.role !== 'assistant') return;

      message.status = 'error';
      message.errorType = action.payload.errorType;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendMessageThunk.pending, () => {
        // no session status mutation
        // optionally log or keep for future extension
        // message-level status is handled inside thunk
        // rejected is kept for thunk lifecycle completeness
      })
      .addCase(sendMessageThunk.fulfilled, () => {
        // Persist stable chat state after stream completion
      })
      .addCase(sendMessageThunk.rejected, () => {
        // Persist stable chat state after stream completion
      });
  },
});

export const selectActiveSession = createSelector(
  (state: { chat: ChatState }) => state.chat.sessions,
  (state: { chat: ChatState }) => state.chat.activeSessionId,
  (sessions, activeSessionId) =>
    sessions.find((session) => session.id === activeSessionId)
);

export const selectSessionStatus = createSelector(
  [
    (state: { chat: ChatState }, activeSessionId: string) =>
      state.chat.sessions.find((s) => s.id === activeSessionId)?.messages || [],
  ],
  (messages) => {
    const lastAssistantMessage = [...messages]
      .reverse()
      .find((m) => m.role === 'assistant');
    return lastAssistantMessage?.status || 'idle';
  }
);

export const {
  loadHistory,
  createNewChat,
  setSessionTitle,
  selectSession,
  deleteSession,
  addMessages,
  updateAssistantMessage,
  addAgentUpdate,
  finalizeAssistantMessage,
  setAssistantMessageRetry,
  markAssistantMessageAborted,
  markAssistantMessageError,
} = chatSlice.actions;

export const chatReducer = chatSlice.reducer;
