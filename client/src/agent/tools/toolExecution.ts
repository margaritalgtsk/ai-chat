import type { AgentStepAction } from '../types';
import { toolRegistry } from './toolRegistry';
import type { ToolResult } from './types';

export const toolExecution = async (
  action: AgentStepAction
): Promise<ToolResult> => {
  const tool = toolRegistry[action.type];

  if (!tool) {
    return {
      success: false,
      result: `Tool ${action.type} not found`,
    };
  }

  try {
    const query = 'query' in action ? action.query : undefined;
    const result = await tool.execute(query);

    return result;
  } catch {
    return {
      success: false,
      result: `Tool execution failed`,
    };
  }
};
