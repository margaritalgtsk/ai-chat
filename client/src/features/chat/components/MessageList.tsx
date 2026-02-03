import type React from 'react';
import styles from '../../../shared/styles/Chat.module.css';
import type { Message } from '../../../types';
import { getErrorText } from '../utils/getErrorText';

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
          {msg.status === 'retrying' && msg.retry && (
            <div className={styles.retry}>
              Retrying… ({msg.retry.attempt}/{msg.retry.max})
            </div>
          )}
          {msg.status === 'error' && (
            <div className={styles.error}>{getErrorText(msg.errorType)}</div>
          )}
        </div>
      ))}
    </div>
  );
};

export default MessageList;
