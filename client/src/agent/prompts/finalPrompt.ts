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

CRITICAL: Use ONLY facts and numbers from the agent steps observations. Do NOT invent, approximate, or paraphrase numerical data (temperatures, prices, times, etc.) — quote them exactly as they appear. For time-sensitive questions (weather, news, events), include the specific date in your answer.

If observations say "No results found" or contain no useful information, respond in a friendly, helpful way: acknowledge you don't have that information and suggest what the user could do instead (e.g. ask a different question, provide more context). Do NOT repeat the technical observation text.

User message:
${userInput}

Conversation history:
${historyText}

Agent steps:
${JSON.stringify(agentSteps, null, 2)}

Write the final answer for the user, using only the data from the observations above.
`;
}
