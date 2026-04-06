import type React from 'react';
import { useLayoutEffect, useRef } from 'react';
import styles from '../../../shared/styles/Chat.module.css';
import type { Message } from '../../../types';
import { getErrorText } from '../utils/getErrorText';

interface MessageListProps {
  sessionId: string;
  messages: Message[];
}

const MessageList: React.FC<MessageListProps> = ({ sessionId, messages }) => {
  const chatBoxRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    const el = chatBoxRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [sessionId, messages]);

  return (
    <div ref={chatBoxRef} className={styles.chatBox}>
      {messages.map((msg, idx) => (
        <div
          key={idx}
          className={`${styles.message} ${
            msg.role === 'user' ? styles.user : styles.assistant
          }`}
        >
          {msg.role === 'assistant' && msg.status === 'streaming' && !msg.content ? (
            <span>
              <span className={styles.typingDot} />
              <span className={styles.typingDot} />
              <span className={styles.typingDot} />
            </span>
          ) : (
            msg.content
          )}
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
