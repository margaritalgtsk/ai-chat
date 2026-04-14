import type React from 'react';
import styles from '../../../shared/styles/Chat.module.css';
import type { ChatSession } from '../../../types';
import { useAppDispatch } from '../../../store/hooks';
import { selectSession } from '../chatSlice';

interface SidebarProps {
  sessions: ChatSession[];
  activeSessionId: string;
  createNewChat: () => void;
  isOpen?: boolean;
  onClose?: () => void;
}
const Sidebar: React.FC<SidebarProps> = ({
  sessions,
  activeSessionId,
  createNewChat,
  isOpen,
  onClose,
}) => {
  const dispatch = useAppDispatch();

  return (
    <div className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ''}`}>
      <div className={styles.sidebarHeader}>
        <h2>Chat Sessions</h2>
        <button
          className={styles.closeSidebarButton}
          onClick={onClose}
          aria-label="Close sessions"
        >
          ×
        </button>
      </div>
      <button
        className={styles.newChatButton}
        onClick={() => { createNewChat(); onClose?.(); }}
      >
        New Session
      </button>
      <div className={styles.sessionList}>
        {sessions.map((session) => (
          <div
            key={session.id}
            onClick={() => { dispatch(selectSession(session.id)); onClose?.(); }}
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
