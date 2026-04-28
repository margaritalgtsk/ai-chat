import type { CallLLM } from '../services/llm/callLLM';

export type AgentContext = {
  userInput: string;
  callLLM: CallLLM;
  signal?: AbortSignal;
  correlationId?: string;
};

export type AgentStepAction = {
  type: 'respond' | 'knowledgeSearch' | 'webSearch' | 'time' | 'memory';
  query?: string;
};

export type AgentStep = {
  thought: string;
  action: AgentStepAction;
  observations?: string;
};

export type AgentResult =
  | { type: 'final'; content: string }
  | { type: 'error'; content: string };
