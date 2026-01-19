export function extractTokens(chunk: string) {
  return chunk
    .split('\n')
    .filter((line) => line.startsWith('data:'))
    .map((line) => line.replace(/^data:/, ''))
    .join('');
}

export function isAbortError(error: unknown): boolean {
  return (
    (error instanceof DOMException && error.name === 'AbortError') ||
    (error instanceof Error && error.message.toLowerCase().includes('aborted'))
  );
}
