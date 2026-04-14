import { useState } from 'react';
import styles from '../../../shared/styles/Chat.module.css';
import Sidebar from './Sidebar';
import MessageInput from './MessageInput';
import MessageList from './MessageList';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import {
  createNewChat,
  selectActiveSession,
  selectSessionStatus,
} from '../chatSlice';

const Chat = () => {
  const dispatch = useAppDispatch();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const activeSessionId = useAppSelector((state) => state.chat.activeSessionId);
  const sessions = useAppSelector((state) => state.chat.sessions);
  const activeSession = useAppSelector(selectActiveSession);
  const activeSessionStatus = useAppSelector((state) =>
    selectSessionStatus(state, activeSessionId || '')
  );

  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className={styles.container}>
      {isSidebarOpen && (
        <div className={styles.backdrop} onClick={closeSidebar} />
      )}
      <Sidebar
        sessions={sessions}
        activeSessionId={activeSessionId}
        createNewChat={() => dispatch(createNewChat())}
        isOpen={isSidebarOpen}
        onClose={closeSidebar}
      />
      <div className={styles.chatContainer}>
        <div className={styles.mobileTopBar}>
          <button
            className={styles.burgerButton}
            onClick={() => setIsSidebarOpen(true)}
            aria-label="Open sessions"
          >
            menu
          </button>
          <span className={styles.mobileTitle}>AI Chat</span>
        </div>
        <MessageList
          sessionId={activeSessionId || ''}
          messages={activeSession?.messages || []}
        />
        <MessageInput
          activeSessionId={activeSessionId}
          isStreaming={activeSessionStatus === 'streaming'}
        />
      </div>
    </div>
  );
};

export default Chat;
