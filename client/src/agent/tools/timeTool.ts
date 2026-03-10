import type { AgentTool } from './types';

export const timeTool: AgentTool = {
  name: 'time',
  description: 'Returns the current date and time in ISO format.',
  execute: async () => ({
    success: true,
    result: new Date().toISOString(),
  }),
};
