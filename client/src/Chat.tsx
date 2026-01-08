import styles from './Chat.module.css';
import Sidebar from './components/Sidebar';
import MessageInput from './components/MessageInput';
import MessageList from './components/MessageList';
import { useChatSessions } from './hooks/useChatSessions';
import { useChatStreaming } from './hooks/useChatStreaming';

const Chat = () => {
  const {
    sessions,
    activeSessionId,
    activeSession,
    updateActiveSessionMessages,
    createNewChat,
  } = useChatSessions();

  const { input, setInput, sendMessage } = useChatStreaming({
    messages: activeSession?.messages || [],
    updateActiveSessionMessages,
  });

  return (
    <div className={styles.container}>
      <Sidebar
        sessions={sessions}
        activeSessionId={activeSessionId}
        createNewChat={createNewChat}
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
