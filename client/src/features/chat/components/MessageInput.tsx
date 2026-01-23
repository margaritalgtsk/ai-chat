import type React from 'react';
import styles from '../../../shared/styles/Chat.module.css';

import { useState } from 'react';
import { useAppDispatch } from '../../../store/hooks';
import { sendMessageThunk } from '../chatThunks';

interface MessageInputProps {
  activeSessionId: string;
  isStreaming: boolean;
}
const MessageInput: React.FC<MessageInputProps> = ({
  activeSessionId,
  isStreaming,
}) => {
  const [input, setInput] = useState('');
  const dispatch = useAppDispatch();

  const sendMessage = () => {
    if (!input.trim()) return;
    dispatch(sendMessageThunk({ sessionId: activeSessionId, text: input }));
    setInput('');
  };
  return (
    <div className={styles.inputRow}>
      <input
        className={styles.input}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
          }
        }}
        placeholder="Write a message..."
      />
      <button
        className={styles.button}
        onClick={sendMessage}
        disabled={isStreaming}
      >
        Send
      </button>
    </div>
  );
};

export default MessageInput;
