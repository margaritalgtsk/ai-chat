export type SearchResult = {
  success: boolean;
  result?: string;
};

export type AgentTool = {
  name: string;
  description: string;
  execute: (input: string) => Promise<SearchResult>;
};
