import { useState } from 'react';
import type { Message } from '../types';
import { extractTokens } from '../utils';

export function useChatStreaming({
  messages,
  updateActiveSessionMessages,
}: {
  messages: Message[];
  updateActiveSessionMessages: (newMessages: Message[]) => void;
}) {
  const [input, setInput] = useState('');

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };
    updateActiveSessionMessages([...messages, userMessage]);

    const aiMessage: Message = { role: 'assistant', content: '' };
    updateActiveSessionMessages([...messages, userMessage, aiMessage]);

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
        updateActiveSessionMessages([
          ...messages,
          userMessage,
          { role: 'assistant', content: assistantContent },
        ]);
      }
    }

    setInput('');
  };

  return { input, setInput, sendMessage };
}
