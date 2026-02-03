//TODO: remove
export function isAbortError(error: unknown): boolean {
  return (
    (error instanceof DOMException && error.name === 'AbortError') ||
    (error instanceof Error && error.message.toLowerCase().includes('aborted'))
  );
}
