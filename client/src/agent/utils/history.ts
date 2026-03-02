import type { Message } from '../../types';

export const historyToText = (history: Message[] | undefined) => {
  const historyText = history
    ?.map((m) => `${m.role.toUpperCase()}: ${m.content}`)
    .join('\n');

  return historyText?.trim().length ? historyText : 'No previous messages.';
};
