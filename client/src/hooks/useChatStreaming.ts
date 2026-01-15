import { useState } from 'react';
import type { Message } from '../types';
import { extractTokens } from '../utils';

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
  console.log(input);

  const sendMessage = async (sessionId: string) => {
    if (!input.trim()) return;
    setInput('');

    const userMessage: Message = { role: 'user', content: input };
    updateSessionMessages({ sessionId, messages: [...messages, userMessage] });

    const aiMessage: Message = { role: 'assistant', content: '' };
    updateSessionMessages({
      sessionId,
      messages: [...messages, userMessage, aiMessage],
    });

    const response = await fetch('http://localhost:3001/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: input }),
    });

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    if (!reader) return; //null check

    let assistantContent = ''; //new

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const raw = decoder.decode(value, { stream: true });
      const token = extractTokens(raw);

      if (token) {
        assistantContent += token; //new
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
  };

  return { input, setInput, sendMessage };
}
