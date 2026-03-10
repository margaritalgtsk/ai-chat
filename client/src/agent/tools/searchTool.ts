import { KNOWLEDGE_BASE } from './knowledgeBase';
import type { AgentTool } from './types';

export const searchTool: AgentTool = {
  name: 'search',
  description:
    'Searches the knowledge base for relevant information based on the query.',
  execute: async (query: string = '') => {
    // - backend API
    // - vector DB
    // - search endpoint
    // - HuggingFace tool
    const lowerQuery = query.toLowerCase();

    const match = KNOWLEDGE_BASE.find((entry) =>
      entry.keywords.some((keyword) =>
        lowerQuery.includes(keyword.toLowerCase().trim())
      )
    );

    if (!match) {
      return {
        success: false,
      };
    }

    return {
      success: true,
      result: match.content,
    };
  },
};
