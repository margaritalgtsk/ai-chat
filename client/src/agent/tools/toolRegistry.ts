import { memoryTool } from './memoryTool';
import { knowledgeSearchTool } from './knowledgeSearch';
import { timeTool } from './timeTool';
import type { AgentTool } from './types';
import { webSearchTool } from './webSearchTool';

export const toolRegistry: Record<string, AgentTool> = {
  webSearch: webSearchTool,
  knowledgeSearch: knowledgeSearchTool,
  time: timeTool,
  memory: memoryTool,
};
