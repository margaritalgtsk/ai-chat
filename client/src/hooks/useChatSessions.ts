import { useState } from 'react';
import { loadChatHistory, saveChatHistory } from '../storage';
import type { ChatSession, Message } from '../types';
import { v4 as uuidv4 } from 'uuid';

export function useChatSessions() {
  const [sessions, setSessions] = useState<ChatSession[]>(loadChatHistory());
  const [activeSessionId, setActiveSessionId] = useState<string>(
    sessions[0].id
  );
  const activeSession = sessions.find((s) => s.id === activeSessionId);

  function updateActiveSessionMessages(newMessages: Message[]) {
    const updated = sessions.map((s) =>
      s.id === activeSessionId ? { ...s, messages: newMessages } : s
    );
    setSessions(updated);
    saveChatHistory(updated);
  }

  const createNewChat = () => {
    const newSession = { id: uuidv4(), messages: [] };
    const updatedSessions = [newSession, ...sessions];
    setSessions(updatedSessions);
    setActiveSessionId(newSession.id);
    saveChatHistory(updatedSessions);
  };

  return {
    sessions,
    activeSessionId,
    activeSession,
    updateActiveSessionMessages,
    createNewChat,
  };
}
