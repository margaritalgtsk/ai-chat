export const agentReasoningPrompt = (input: string) => `
You are an AI assistant that classifies user intent.

User message:
"${input}"

Respond ONLY in JSON:
{
  "intent": "chat | question | needs_clarification",
  "reason": "short explanation"
}
`;
