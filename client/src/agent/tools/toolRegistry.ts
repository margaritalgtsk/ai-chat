import { memoryTool } from './memoryTool';
import { searchTool } from './searchTool';
import { timeTool } from './timeTool';
import type { AgentTool } from './types';

export const toolRegistry: Record<string, AgentTool> = {
  search: searchTool,
  time: timeTool,
  memory: memoryTool,
};
