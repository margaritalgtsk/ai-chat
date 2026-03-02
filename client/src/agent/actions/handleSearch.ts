import type { AgentDecision } from '../schemas/decisionSchema';
import { searchTool } from '../tools/searchTool';
import type { AgentStep } from '../types';

type SearchAction = Extract<AgentDecision['action'], { type: 'search' }>;

export const handleSearch = async ({
  agentSteps,
  action,
  thought,
}: {
  agentSteps: AgentStep[];
  action: SearchAction;
  thought: string;
}): Promise<AgentStep> => {
  const previousQueries = agentSteps
    .filter((s) => s.action.type === 'search')
    .map((s) => s.action.query);

  if (previousQueries.includes(action.query)) {
    return {
      thought: thought,
      action: action,
      observations:
        'Search skipped: query already executed. Choose respond or new query.',
    };
  }

  const result = await searchTool(action.query);

  return {
    thought: thought,
    action: action,
    observations:
      result.success && result.result
        ? result.result
        : 'No relevant results found.',
  };
};
