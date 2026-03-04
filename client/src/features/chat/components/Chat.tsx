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

  const activeSessionId = useAppSelector((state) => state.chat.activeSessionId);
  const sessions = useAppSelector((state) => state.chat.sessions);
  const activeSession = useAppSelector(selectActiveSession);
  const activeSessionStatus = useAppSelector((state) =>
    selectSessionStatus(state, activeSessionId || '')
  );

  return (
    <div className={styles.container}>
      <Sidebar
        sessions={sessions}
        activeSessionId={activeSessionId}
        createNewChat={() => dispatch(createNewChat())}
      />
      <div className={styles.chatContainer}>
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
