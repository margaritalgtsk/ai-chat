import type { AgentStep } from '../types';

export const criticPrompt = ({
  userInput,
  finalAnswer,
  agentSteps,
}: {
  userInput: string;
  finalAnswer: string;
  agentSteps: AgentStep[];
}) => {
  return `
You are a strict AI critic.

Your job is to evaluate whether the assistant's answer is complete, correct, and sufficient.

User request:
${userInput}

Assistant answer:
${finalAnswer}

Agent steps:
${agentSteps.length ? JSON.stringify(agentSteps, null, 2) : 'No previous agent steps.'}

---

Available actions:
- search: search external information
- memory: recall known information about the user
- time: get current time/date
- respond: return final answer

---

Evaluate:

1. Is the answer complete?
2. Is anything missing?
3. Should the agent take another action?

Important: Before suggesting a retry, check the agent steps above.
If the agent already used the relevant tool (memory, search, time), do NOT suggest retrying with the same tool.
Only set "retry": true if the answer is clearly wrong or missing critical information that was NOT already looked up.

---

Respond ONLY in JSON:

{
  "retry": boolean,
  "feedback": "short explanation"
  }
`;
};
