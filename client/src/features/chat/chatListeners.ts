import { createListenerMiddleware, isAnyOf } from '@reduxjs/toolkit';

import { abortChatStream } from './chatAbortControllers';
import type { RootState } from '../../store/store';
import { sendMessageThunk } from './chatThunks';
import { saveChatHistory } from '../../storage';
import {
  createNewChat,
  selectSession,
  updateSessionMessages,
} from './chatSlice';

export const chatListener = createListenerMiddleware();

chatListener.startListening({
  matcher: isAnyOf(selectSession, createNewChat),
  //effect: async (action, listenerApi) => {
  effect: async (_, listenerApi) => {
    const state = listenerApi.getOriginalState() as RootState;
    const prevSessionId = state.chat.activeSessionId;
    if (prevSessionId) {
      abortChatStream(prevSessionId);
    }
  },
});

chatListener.startListening({
  matcher: isAnyOf(
    createNewChat,
    updateSessionMessages,
    sendMessageThunk.fulfilled,
    sendMessageThunk.rejected
  ),
  effect: (_, listenerApi) => {
    const state = listenerApi.getState() as RootState;
    saveChatHistory(state.chat.sessions);
  },
});
