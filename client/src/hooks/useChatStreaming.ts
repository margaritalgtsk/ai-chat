import { useRef, useState } from 'react';
import type { Message } from '../types';
import { extractTokens, isAbortError } from '../utils';
import { updateStatusSession } from '../store/chatSlice';
import { useAppDispatch } from '../store/hooks';

export function useChatStreaming({
  messages,
  updateSessionMessages,
}: {
  messages: Message[];
  updateSessionMessages: ({
    sessionId,
    messages,
  }: {
    sessionId: string;
    messages: Message[];
  }) => void;
}) {
  const [input, setInput] = useState('');
  const controllerRef = useRef<AbortController | null>(null);
  const dispatch = useAppDispatch();

  const sendMessage = async (sessionId: string) => {
    if (!input.trim()) return;

    if (controllerRef.current) {
      controllerRef.current.abort();
    }

    controllerRef.current = new AbortController();
    const { signal } = controllerRef.current;

    dispatch(updateStatusSession({ sessionId, status: 'streaming' }));

    const userMessage: Message = { role: 'user', content: input };
    updateSessionMessages({ sessionId, messages: [...messages, userMessage] });

    const aiMessage: Message = { role: 'assistant', content: '' };
    updateSessionMessages({
      sessionId,
      messages: [...messages, userMessage, aiMessage],
    });

    try {
      const response = await fetch('http://localhost:3001/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
        signal,
      });

      setInput('');
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) return;

      let assistantContent = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const raw = decoder.decode(value, { stream: true });
        const token = extractTokens(raw);

        if (token) {
          assistantContent += token;
          updateSessionMessages({
            sessionId,
            messages: [
              ...messages,
              userMessage,
              { role: 'assistant', content: assistantContent },
            ],
          });
        }
      }
    } catch (error) {
      if (isAbortError(error)) return;
      dispatch(updateStatusSession({ sessionId, status: 'error' }));
    } finally {
      dispatch(updateStatusSession({ sessionId, status: 'idle' }));
    }
  };

  const abortStreaming = () => {
    controllerRef.current?.abort();
    controllerRef.current = null;
  };

  return { input, setInput, sendMessage, abortStreaming };
}
