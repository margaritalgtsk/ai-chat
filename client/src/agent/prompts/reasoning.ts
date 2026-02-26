import type { Message } from '../../types';
import { historyToText } from '../utils';

export const agentReasoningPrompt = ({
  userInput,
  history,
  observations,
}: {
  userInput: string;
  history?: Message[];
  observations?: string;
}) => {
  const historyText = historyToText(history);

  return `
You are an AI assistant that classifies user intent.

User message:
"${userInput}"

Previous conversation:
${historyText}

Observations:
${observations ?? 'No observations yet.'}

Respond ONLY in valid JSON (no extra text):

{
  "thought": "what you think",
  "action": {
    "type": "respond | search",
    "query": "search query if needed"
  }
}

Rules:
- Do not include any text outside the JSON
`;
};
