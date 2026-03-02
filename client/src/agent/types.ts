import type { CallLLM } from '../services/llm/callLLM';

export type AgentContext = {
  userInput: string;
  callLLM: CallLLM;
  signal?: AbortSignal;
  correlationId?: string;
};

export type AgentStep = {
  thought: string;
  action: {
    type: 'respond' | 'search';
    query?: string;
  };
  observations?: string;
};

export type AgentResult =
  | { type: 'final'; content: string }
  | { type: 'error'; content: string };
