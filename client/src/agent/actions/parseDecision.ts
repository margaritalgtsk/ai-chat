import {
  AgentDecisionSchema,
  type AgentDecision,
} from '../schemas/decisionSchema';
import { extractJSON } from '../utils/json';

export const parseDecision = (reasoningCall: string): AgentDecision | null => {
  const jsonResultCall = extractJSON(reasoningCall);
  if (!jsonResultCall) {
    return null;
  }

  try {
    const parsed = AgentDecisionSchema.safeParse(JSON.parse(jsonResultCall));
    if (!parsed.success) {
      return null;
    }
    return parsed.data;
  } catch {
    return null;
  }
};
