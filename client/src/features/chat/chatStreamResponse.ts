import { mockChatStream } from './mockChatStream';

export const streamChatResponse = async ({
  text,
  signal,
  onChunk,
}: {
  text: string;
  signal: AbortSignal;
  onChunk: (chunk: string) => void;
}) => {
  if (import.meta.env.VITE_MOCK_CHAT_STREAM === 'true') {
    await mockChatStream({ onChunk, signal });
    return;
  }

  const response = await fetch('http://localhost:3001/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: text }),
    signal,
  });

  if (!response.ok) {
    throw new Error('Server error');
  }

  const reader = response.body?.getReader();
  if (!reader) throw new Error('No stream');

  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    //const raw = decoder.decode(value, { stream: true });
    //const token = extractTokens(raw);
    onChunk(decoder.decode(value, { stream: true }));
  }
};
