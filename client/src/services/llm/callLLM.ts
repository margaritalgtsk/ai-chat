import { log } from '../../observability/logger';

export type CallLLMParams = {
  text: string;
  signal?: AbortSignal;
  correlationId?: string;
};

export type CallLLM = (params: CallLLMParams) => Promise<string>;

export const callLLM: CallLLM = async ({ text, signal, correlationId }) => {
  const response = await fetch('http://localhost:3001/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: text }),
    signal,
  });

  if (!response.ok) {
    log.error('Stream response error', {
      correlationId,
      status: response.status,
    });
    throw new Error('Server error');
  }

  const reader = response.body?.getReader();
  if (!reader) {
    log.error('No stream reader', { correlationId });
    throw new Error('No stream');
  }

  const decoder = new TextDecoder();

  let fullResponse = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      log.info('Stream completed', { correlationId });
      break;
    }
    //const raw = decoder.decode(value, { stream: true });
    //const token = extractTokens(raw);
    //onChunk(decoder.decode(value, { stream: true }));

    const chunk = decoder.decode(value, { stream: true });
    fullResponse += chunk;
  }
  return fullResponse;
};
