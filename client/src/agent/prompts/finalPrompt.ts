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

User message:
${userInput}

Conversation history:
${historyText}

${agentSteps.length ? `Agent steps (use ONLY this data to answer):
${JSON.stringify(agentSteps, null, 2)}

CRITICAL: Do NOT invent or paraphrase numerical data — quote it exactly as it appears in observations.
If observations include both web results and studio service information: answer the question first, then add a single casual sentence at the end mentioning the studio can help — keep it brief and non-pushy.
If observations say "No results found":
- If the action type was "memory": tell the user you haven't stored that yet, but you CAN remember things across sessions — invite them to share the information now.
- Otherwise: tell the user you don't have that information in a friendly way and suggest they try a different question.
Do NOT repeat the technical observation text.

Write the final answer using only the data from the observations above.`
: `No tools were called. Answer directly based on the user message and conversation history above.

Your available tools (use this to answer capability questions):
- webSearch: search the internet for current events, news, general knowledge
- knowledgeSearch: search internal knowledge about the team, company, and product
- time: get the current date and time
- memory: remember and recall information about the user across sessions`}
`;
}
