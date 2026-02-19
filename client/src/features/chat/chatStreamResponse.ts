import { runAgent } from '../../agent/agentRunner';
import { log } from '../../observability/logger';
import { callLLM } from '../../services/llm/callLLM';
import { mockChatStream } from './mockChatStream';

export const streamChatResponse = async ({
  text,
  signal,
  correlationId,
  onChunk,
}: {
  text: string;
  signal: AbortSignal;
  correlationId: string;
  onChunk: (chunk: string) => void;
}) => {
  log.info('Stream opened', { correlationId });

  if (import.meta.env.VITE_MOCK_CHAT_STREAM !== 'true') {
    await mockChatStream({ onChunk, signal });
    return;
  }

  const response = await runAgent({
    userInput: text,
    callLLM,
    correlationId,
    signal,
  });
  log.info('Agent response received', { correlationId, response });
  onChunk(response.content);
};
