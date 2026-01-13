import styles from './Chat.module.css';
import Sidebar from './components/Sidebar';
import MessageInput from './components/MessageInput';
import MessageList from './components/MessageList';
import { useChatStreaming } from './hooks/useChatStreaming';
import { useAppDispatch, useAppSelector } from './store/hooks';
import {
  createNewChat,
  selectActiveSession,
  updateActiveSessionMessages,
} from './store/chatSlice';

const Chat = () => {
  const dispatch = useAppDispatch();

  const activeSessionId = useAppSelector((state) => state.chat.activeSessionId);
  const sessions = useAppSelector((state) => state.chat.sessions);
  const activeSession = useAppSelector(selectActiveSession);

  const { input, setInput, sendMessage } = useChatStreaming({
    messages: activeSession?.messages || [],
    updateActiveSessionMessages: (messages) =>
      dispatch(updateActiveSessionMessages(messages)),
  });

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
          input={input}
          setInput={setInput}
          sendMessage={sendMessage}
        />
      </div>
    </div>
  );
};

export default Chat;
