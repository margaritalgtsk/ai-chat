import { createAsyncThunk } from '@reduxjs/toolkit';
import type { RootState } from '../../store/store';
import {
  addMessages,
  finalizeAssistantMessage,
  markAssistantMessageAborted,
  markAssistantMessageError,
  setAssistantMessageRetry,
  updateAssistantMessage,
} from './chatSlice';
import type { Message } from '../../types';
import {
  abortChatStream,
  createChatAbortController,
} from './chatAbortControllers';
import { v4 as uuidv4 } from 'uuid';
import { getChatErrorType } from './utils/getChatErrorType';
import { streamChatResponse } from './chatStreamResponse';
import { MAX_RETRIES } from './constants';
import { log } from '../../observability/logger';
import { streamRegistry } from '../../dev/activeStreams';

export const sendMessageThunk = createAsyncThunk<
  void,
  { sessionId: string; text: string },
  { state: RootState } // type for getState()
>('chat/sendMessage', async ({ sessionId, text }, thunkApi) => {
  //const state = thunkApi.getState();
  const correlationId = uuidv4();

  const controller = createChatAbortController(sessionId);
  const userMessage: Message = { id: uuidv4(), role: 'user', content: text };
  const aiMessage: Message = {
    id: uuidv4(),
    role: 'assistant',
    content: '',
    status: 'streaming',
    correlationId,
  };

  thunkApi.dispatch(
    addMessages({
      sessionId,
      messages: [userMessage, aiMessage],
    })
  );

  streamRegistry.start({
    sessionId,
    messageId: aiMessage.id,
    correlationId,
    startedAt: Date.now(),
    retryAttempt: 0,
  });

  log.info('Start streaming', {
    sessionId,
    messageId: aiMessage.id,
    correlationId,
  });

  try {
    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      try {
        let assistantContent = '';

        await streamChatResponse({
          text,
          signal: controller.signal,
          correlationId,
          onChunk: (chunk) => {
            assistantContent += chunk;

            log.debug('Chunk received', {
              correlationId,
              length: chunk.length,
            });

            thunkApi.dispatch(
              updateAssistantMessage({
                sessionId,
                messageId: aiMessage.id,
                content: assistantContent,
              })
            );
          },
        });
        thunkApi.dispatch(
          finalizeAssistantMessage({
            sessionId,
            messageId: aiMessage.id,
          })
        );
        log.info('Stream completed successfully', {
          sessionId,
          messageId: aiMessage.id,
          correlationId,
        });
        return;
      } catch (error) {
        const errorType = getChatErrorType(error);

        if (errorType === 'abort') {
          throw error;
        }

        if (attempt < MAX_RETRIES) {
          thunkApi.dispatch(
            setAssistantMessageRetry({
              sessionId,
              messageId: aiMessage.id,
              attempt: attempt + 1,
              max: MAX_RETRIES,
            })
          );
          streamRegistry.retry(correlationId, attempt + 1);
          log.warn('Retry streaming', {
            sessionId,
            messageId: aiMessage.id,
            attempt,
          });
          await new Promise((r) => setTimeout(r, 500 * Math.pow(2, attempt)));
          continue;
        }
        throw error;
      }
    }
  } catch (error) {
    const errorType = getChatErrorType(error);

    if (errorType === 'abort') {
      thunkApi.dispatch(
        markAssistantMessageAborted({
          sessionId,
          messageId: aiMessage.id,
        })
      );
      streamRegistry.abort(correlationId);
      log.info('Stream aborted by user', {
        correlationId,
        sessionId,
        messageId: aiMessage.id,
      });
    } else {
      thunkApi.dispatch(
        markAssistantMessageError({
          sessionId,
          messageId: aiMessage.id,
          errorType,
        })
      );
      log.error('Streaming failed', {
        sessionId,
        messageId: aiMessage.id,
        error,
      });
    }
    throw error;
  } finally {
    abortChatStream(sessionId);
    log.debug('Chat stream cleaned up', { sessionId });
    streamRegistry.end(correlationId);
  }
});
