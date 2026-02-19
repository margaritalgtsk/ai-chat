export type AgentIntent = 'chat' | 'question' | 'needs_clarification';

export type AgentDecision = {
  intent: AgentIntent;
  reason: string;
};

export type AgentResult =
  | { type: 'final'; content: string }
  | { type: 'clarification'; content: string }
  | { type: 'error'; content: string };
