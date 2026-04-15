import { memoryTool } from './memoryTool';
import { knowledgeSearchTool } from './searchTool';
import { timeTool } from './timeTool';
import type { AgentTool } from './types';

export const toolRegistry: Record<string, AgentTool> = {
  knowledgeSearch: knowledgeSearchTool,
  time: timeTool,
  memory: memoryTool,
};
