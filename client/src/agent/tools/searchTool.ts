import { KNOWLEDGE_BASE } from './knowledgeBase';

type SearchResult = {
  success: boolean;
  result?: string;
};

export async function searchTool(query: string): Promise<SearchResult> {
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
}
