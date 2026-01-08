import type React from 'react';
import styles from '../Chat.module.css';

interface MessageInputProps {
  input: string;
  setInput: (value: string) => void;
  sendMessage: () => void;
}
const MessageInput: React.FC<MessageInputProps> = ({
  input,
  setInput,
  sendMessage,
}) => {
  return (
    <div className={styles.inputRow}>
      <input
        className={styles.input}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Write a message..."
      />
      <button className={styles.button} onClick={sendMessage}>
        Send
      </button>
    </div>
  );
};

export default MessageInput;
