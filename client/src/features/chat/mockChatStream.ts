export const mockChatStream = async ({
  onChunk,
  signal,
}: {
  onChunk: (chunk: string) => void;
  signal: AbortSignal;
}) => {
  const chunks = ['Hello', ', ', 'this ', 'is ', 'a ', 'mock ', 'stream.'];

  for (const chunk of chunks) {
    if (signal.aborted) {
      throw new DOMException('Aborted', 'AbortError');
    }

    await new Promise((r) => setTimeout(r, 400));
    onChunk(chunk);
  }
};
