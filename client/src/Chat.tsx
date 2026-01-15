import styles from './Chat.module.css';
import Sidebar from './components/Sidebar';
import MessageInput from './components/MessageInput';
import MessageList from './components/MessageList';
import { useChatStreaming } from './hooks/useChatStreaming';
import { useAppDispatch, useAppSelector } from './store/hooks';
import {
  createNewChat,
  selectActiveSession,
  updateSessionMessages,
} from './store/chatSlice';
import type { Message } from './types';

const Chat = () => {
  const dispatch = useAppDispatch();

  const activeSessionId = useAppSelector((state) => state.chat.activeSessionId);
  const sessions = useAppSelector((state) => state.chat.sessions);
  const activeSession = useAppSelector(selectActiveSession);

  const updateMessagesForSession = ({
    sessionId,
    messages,
  }: {
    sessionId: string;
    messages: Message[];
  }) => {
    dispatch(updateSessionMessages({ sessionId, messages }));
  };

  const { input, setInput, sendMessage } = useChatStreaming({
    messages: activeSession?.messages || [],
    updateSessionMessages: updateMessagesForSession,
  });

  const handleSendMessage = () => {
    if (!activeSessionId) return;
    sendMessage(activeSessionId);
  };

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
          sendMessage={handleSendMessage}
        />
      </div>
    </div>
  );
};

export default Chat;
