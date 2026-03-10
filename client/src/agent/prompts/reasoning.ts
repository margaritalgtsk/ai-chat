import type { Message } from '../../types';
import type { AgentStep } from '../types';
import { historyToText } from '../utils/history';

export const agentReasoningPrompt = ({
  userInput,
  history,
  agentSteps,
}: {
  userInput: string;
  history?: Message[];
  agentSteps: AgentStep[];
}) => {
  const historyText = historyToText(history);

  return `
You are a ReAct agent that can solve tasks by thinking step-by-step and using tools.

You have access to the following tools:

1. search(query: string)
Use this to search the web for information you do not know.

2. time()
Use this to get the current date and time.

Important limitations:
- You do NOT know the current date or time.
- If the user asks about today, current date, current time, or day of week, you MUST use the time tool first.

Rules:
- Think step by step.
- Choose the best action.
- Only use tools when needed.
- Respond ONLY in valid JSON.
- Do NOT include any text outside JSON.
- If observations already contain enough information to answer,
  you MUST choose action: respond.
- NEVER repeat the same search query.
- Maximum searches allowed: 3.
- Prefer responding over searching again.

JSON format:

{
  "thought": "your reasoning",
  "action": {
    "type": "search | time | respond",
    "query": "query if needed"
  }
}

User message:
"${userInput}"

Previous conversation:
${historyText || 'No previous conversation.'}

Agent steps:
${agentSteps.length ? JSON.stringify(agentSteps, null, 2) : 'No previous agent steps.'}
`;
};
