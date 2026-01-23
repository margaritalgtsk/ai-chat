import { createAsyncThunk } from '@reduxjs/toolkit';
import type { RootState } from '../../store/store';
import { updateSessionMessages } from './chatSlice';
import type { Message } from '../../types';
import {
  abortChatStream,
  createChatAbortController,
} from './chatAbortControllers';
import { extractTokens } from './utils/extractTokens';
import { isAbortError } from './utils/isAbortError';

export const sendMessageThunk = createAsyncThunk<
  void,
  { sessionId: string; text: string },
  { state: RootState } // type for getState()
>('chat/sendMessage', async ({ sessionId, text }, thunkApi) => {
  const state = thunkApi.getState();
  const messages =
    state.chat.sessions.find((s) => s.id === sessionId)?.messages || [];

  const controller = createChatAbortController(sessionId);

  const userMessage: Message = { role: 'user', content: text };
  const aiMessage: Message = { role: 'assistant', content: '' };

  thunkApi.dispatch(
    updateSessionMessages({
      sessionId,
      messages: [...messages, userMessage, aiMessage],
    })
  );

  try {
    const response = await fetch('http://localhost:3001/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: text }),
      //signal: thunkApi.signal,
      signal: controller.signal,
    });

    const reader = response.body?.getReader();
    if (!reader) return;

    const decoder = new TextDecoder();

    let assistantContent = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const raw = decoder.decode(value, { stream: true });
      const token = extractTokens(raw);

      if (token) {
        assistantContent += token;
        thunkApi.dispatch(
          updateSessionMessages({
            sessionId,
            messages: [
              ...messages,
              userMessage,
              { role: 'assistant', content: assistantContent },
            ],
          })
        );
      }
    }
  } catch (error) {
    if (isAbortError(error)) {
      return thunkApi.rejectWithValue('aborted');
    }
    throw error;
  } finally {
    abortChatStream(sessionId);
  }
});
