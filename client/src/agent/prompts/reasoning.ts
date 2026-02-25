export const agentReasoningPrompt = ({ userInput }: { userInput: string }) => `
You are an AI assistant that classifies user intent.

User message:
"${userInput}"

Respond ONLY in valid JSON (no extra text):

{
  "intent": "chat | question | needs_clarification | search",
  "reason": "short explanation",
  "confidence": number between 0 and 1
}

Rules:
- confidence must be a number between 0 and 1
- Use lower confidence if the intent is ambiguous
- Do not include any text outside the JSON
`;
