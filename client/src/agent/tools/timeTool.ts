import type { AgentTool } from './types';

export const timeTool: AgentTool = {
  name: 'time',
  description: 'Returns the current date and time in ISO format.',
  execute: () => ({
    success: true,
    result: new Date().toISOString(),
  }),
};
