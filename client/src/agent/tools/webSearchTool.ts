import type { AgentTool } from './types';

type SearchResult = {
  title: string;
  url: string;
  content: string;
};

export const webSearchTool: AgentTool = {
  name: 'webSearch',
  description:
    'Searches the internet for current information, recent events, news, or any topic that requires up-to-date data. Use this when the user asks about something that may have changed recently or is not covered by internal knowledge',
  execute: async (query: string = '') => {
    const apiUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';
    const response = await fetch(`${apiUrl}/api/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      throw new Error('Web search failed');
    }

    const data = await response.json();
    if (!data.results || data.results.length === 0) {
      return { success: false, result: 'No results found' };
    }

    const formatted = data.results
      .map(
        (r: SearchResult, i: number) =>
          `[${i + 1}] ${r.title}\nURL: ${r.url}\n${r.content}`
      )
      .join('\n\n');

    return { success: true, result: formatted };
  },
};
