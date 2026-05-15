import { runAgent } from '../../agent/agentRunner';
//import { log } from '../../observability/logger';
import { callLLM } from '../../services/llm/callLLM';
import type { Message } from '../../types';
import { mockChatStream } from './mockChatStream';
import type { AgentUpdate } from '../../agent/types';

export const streamChatResponse = async ({
  text,
  signal,
  history,
  correlationId,
  onChunk,
  onUpdate,
}: {
  text: string;
  signal: AbortSignal;
  history: Message[];
  correlationId: string;
  onChunk: (chunk: string) => void;
  onUpdate: (update: AgentUpdate) => void;
}) => {
  //log.info('Stream opened', { correlationId });

  if (import.meta.env.VITE_MOCK_CHAT_STREAM === 'true') {
    await mockChatStream({ onChunk, signal });
    return;
  }

  const gen = runAgent({
    userInput: text,
    history,
    callLLM,
    correlationId,
    signal,
  });

  while (true) {
    const next = await gen.next();
    if (next.done) {
      onChunk(next.value.content);
      break;
    }
    onUpdate(next.value);
  }
};
