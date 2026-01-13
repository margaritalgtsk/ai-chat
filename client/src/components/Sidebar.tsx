import type React from 'react';
import type { ChatSession } from '../types';
import styles from '../Chat.module.css';
import { useAppDispatch } from '../store/hooks';
import { selectSession } from '../store/chatSlice';

interface SidebarProps {
  sessions: ChatSession[];
  activeSessionId: string;
  createNewChat: () => void;
}
const Sidebar: React.FC<SidebarProps> = ({
  sessions,
  activeSessionId,
  createNewChat,
}) => {
  console.log('Sidebar sessions:', sessions);
  console.log('Active Session ID:', activeSessionId);

  const dispatch = useAppDispatch();

  return (
    <div className={styles.sidebar}>
      <h2>Chat Sessions</h2>
      <button className={styles.newChatButton} onClick={createNewChat}>
        New Session
      </button>
      <div className={styles.sessionList}>
        {sessions.map((session) => (
          <div
            key={session.id}
            onClick={() => dispatch(selectSession(session.id))}
            className={`${styles.sessionItem} ${session.id === activeSessionId ? styles.activeSession : ''}`}
          >
            {session.messages[0]?.content.slice(0, 20) || 'Current Session'}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
