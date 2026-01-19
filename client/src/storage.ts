import type { ChatSession } from './types';

const CHAT_STORAGE_KEY = 'chat_history';

export function saveChatHistory(history: ChatSession[]) {
  localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(history));
}

export function loadChatHistory(): ChatSession[] {
  const data = localStorage.getItem(CHAT_STORAGE_KEY);
  let sessions = data ? JSON.parse(data) : [];

  if (sessions.length === 0) {
    sessions = [{ id: 'default', messages: [], status: 'idle' }];
    localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(sessions));
  }
  return sessions;
}
