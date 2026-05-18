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

IMPORTANT: Always respond in the same language as the user's message. If the user wrote in Russian, respond entirely in Russian. If in English, respond in English. Do not mix languages.

User message:
${userInput}

Conversation history:
${historyText}

${agentSteps.length ? `Agent steps (use ONLY this data to answer):
${JSON.stringify(agentSteps, null, 2)}

CRITICAL: Do NOT invent or paraphrase numerical data — quote it exactly as it appears in observations.
If observations include studio knowledge base results (pricing, process, services, team, NDA, timeline, support): lead with that information as the primary answer. Only supplement with web results if the knowledge base didn't fully answer the question. Do NOT let generic web statistics override specific studio information.
Studio mention rule — read carefully:
- ONLY add a studio mention if ALL of these are true: (1) agent steps contain a "knowledgeSearch" action, AND (2) its observations include a [company] tagged result about services, pricing, engagement models, or support — NOT about team members, location, values, or product features.
- If knowledgeSearch returned only [people], [product], or [tech] results: NEVER add a studio mention.
- If there is NO "knowledgeSearch" action in the steps: NEVER mention the studio.
- When the condition is met: answer the question first, then add one brief sentence. Say "our studio", not "a studio".
- NEVER invent studio mentions.
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
