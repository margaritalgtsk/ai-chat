import type { AgentStep } from '../types';

export function buildFinalPrompt(steps: AgentStep[], userInput: string) {
  return `
You MUST now produce the FINAL ANSWER.

Do NOT search.
Do NOT continue reasoning.
Do NOT output JSON.

Use the agent steps below to answer the user.

Agent steps:
${JSON.stringify(steps, null, 2)}

User question:
${userInput}
`;
}
