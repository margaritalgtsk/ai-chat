type SearchResult = {
  success: boolean;
  result?: string;
};

const KNOWLEDGE_BASE = [
  {
    keywords: ['react version', 'latest react'],
    content: 'The latest stable React version is React 19.',
  },
  {
    keywords: ['redux', 'latest redux'],
    content: 'The latest stable Redux version is Redux 5.0.1.',
  },
  {
    keywords: ['cat', 'name'],
    content: 'The most common cat names are Whiskers, Mittens, and Fluffy.',
  },
  {
    keywords: ['weather', 'Limassol'],
    content:
      'Limassol is a city in Cyprus with a Mediterranean climate. It typically has warm, dry summers and mild winters.',
  },
];

export async function searchTool(query: string): Promise<SearchResult> {
  // - backend API
  // - vector DB
  // - search endpoint
  // - HuggingFace tool

  const lowerQuery = query.toLowerCase();
  const match = KNOWLEDGE_BASE.find((entry) =>
    entry.keywords.some((keyword) => lowerQuery.includes(keyword))
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
