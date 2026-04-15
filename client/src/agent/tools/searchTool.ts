import { KNOWLEDGE_BASE } from './knowledgeBase';
import type { KBEntry } from './knowledgeBase';
import type { AgentTool } from './types';

const MAX_RESULTS = 3;

function scoreEntry(entry: KBEntry, lowerQuery: string): number {
  return entry.keywords.filter((kw) =>
    lowerQuery.includes(kw.toLowerCase().trim())
  ).length;
}

export const knowledgeSearchTool: AgentTool = {
  name: 'knowledgeSearch',
  description:
    'Searches the internal knowledge base for information about the team, company, services, and product.',
  execute: (query: string = '') => {
    const lowerQuery = query.toLowerCase();

    const scored = KNOWLEDGE_BASE.map((entry) => ({
      entry,
      score: scoreEntry(entry, lowerQuery),
    }))
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, MAX_RESULTS);

    if (scored.length === 0) {
      return { success: false };
    }

    const result = scored
      .map(({ entry }) => `[${entry.category}] ${entry.content}`)
      .join('\n\n');

    return {
      success: true,
      result,
    };
  },
};
