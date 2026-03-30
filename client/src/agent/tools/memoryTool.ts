import { memoryStore } from '../memory/memoryStore';
import type { AgentTool } from './types';

export const memoryTool: AgentTool = {
  name: 'memory',
  description: 'Stores and retrieves information relevant to the conversation.',
  execute: (query?: string) => {
    if (!query) {
      return {
        success: false,
        result: 'Query is not provided.',
      };
    }

    const isAllQuery = query.trim().toLowerCase() === 'all';
    const result = isAllQuery ? memoryStore.getAll() : memoryStore.search(query);
    console.log('Memory search results', { query, result });

    if (!result.length) {
      return {
        success: false,
        result: 'No relevant information found in memory.',
      };
    }

    return {
      success: true,
      result: result.map((m) => `${m.key}: ${m.value}`).join('\n'),
    };
  },
};
