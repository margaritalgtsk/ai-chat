import styles from '../../../shared/styles/Chat.module.css';
import Sidebar from './Sidebar';
import MessageInput from './MessageInput';
import MessageList from './MessageList';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { createNewChat, selectActiveSession } from '../chatSlice';

const Chat = () => {
  const dispatch = useAppDispatch();

  const activeSessionId = useAppSelector((state) => state.chat.activeSessionId);
  const sessions = useAppSelector((state) => state.chat.sessions);
  const activeSession = useAppSelector(selectActiveSession);

  return (
    <div className={styles.container}>
      <Sidebar
        sessions={sessions}
        activeSessionId={activeSessionId}
        createNewChat={() => dispatch(createNewChat())}
      />
      <div className={styles.chatContainer}>
        <MessageList messages={activeSession?.messages || []} />
        <MessageInput
          activeSessionId={activeSessionId}
          isStreaming={activeSession?.status === 'streaming'}
        />
      </div>
    </div>
  );
};

export default Chat;
