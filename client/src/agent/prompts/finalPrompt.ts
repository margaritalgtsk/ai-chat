import type { Message } from '../../types';
import type { AgentStep } from '../types';
import { historyToText } from '../utils/history';

export function finalPrompt({
  agentSteps,
  userInput,
  history,
}: {
  agentSteps: AgentStep[];
  userInput: string;
  history?: Message[];
}) {
  const historyText = historyToText(history);

  return `
You MUST now produce the FINAL ANSWER.

Do NOT search.
Do NOT continue reasoning.
Do NOT output JSON.

Use the information below to answer the user.

User message:
${userInput}

Conversation history:
${historyText}

Agent steps:
${JSON.stringify(agentSteps, null, 2)}

Write the final answer for the user.
`;
}
