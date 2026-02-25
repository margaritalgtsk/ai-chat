export type AgentIntent =
  | 'chat'
  | 'question'
  | 'needs_clarification'
  | 'search';

export type AgentDecision = {
  intent: AgentIntent;
  reason: string;
  confidence?: number;
};

export type AgentResult =
  | { type: 'final'; content: string }
  | { type: 'clarification'; content: string }
  | { type: 'error'; content: string };
