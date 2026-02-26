import type { Message } from '../types';

export const extractJSON = (text: string): string | null => {
  const match = text.match(/\{[\s\S]*\}/);
  return match ? match[0] : null;
};

export const historyToText = (history: Message[] | undefined) => {
  const historyText = history
    ?.map((m) => `${m.role.toUpperCase()}: ${m.content}`)
    .join('\n');

  return historyText?.trim().length ? historyText : 'No previous messages.';
};
