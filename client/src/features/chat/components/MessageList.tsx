import type React from 'react';
import styles from '../../../shared/styles/Chat.module.css';
import type { Message } from '../../../types';

interface MessageListProps {
  messages: Message[];
}

const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  return (
    <div className={styles.chatBox}>
      {messages.map((msg, idx) => (
        <div
          key={idx}
          className={`${styles.message} ${
            msg.role === 'user' ? styles.user : styles.assistant
          }`}
        >
          {msg.content}
        </div>
      ))}
    </div>
  );
};

export default MessageList;
