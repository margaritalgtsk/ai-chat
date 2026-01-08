export function extractTokens(chunk: string) {
  return chunk
    .split('\n')
    .filter((line) => line.startsWith('data:'))
    .map((line) => line.replace(/^data:/, ''))
    .join('');
}
