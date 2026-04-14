import type React from 'react';
import styles from '../../../shared/styles/WelcomeModal.module.css';

interface WelcomeModalProps {
  onClose: () => void;
}

const WelcomeModal: React.FC<WelcomeModalProps> = ({ onClose }) => {
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.title}>Welcome to AI Chat</h2>
        <p className={styles.intro}>
          This chat is powered by a <strong>ReAct agent</strong> (Reasoning +
          Acting) running on <strong>Groq</strong>'s LLaMA model. The agent
          thinks step by step and can use tools to answer your questions.
        </p>
        <ul className={styles.tools}>
          <li>
            <span className={styles.toolIcon}>🕐</span>
            <div>
              <strong>Time</strong>
              <span className={styles.toolDesc}>
                Answers questions about the current date and time
              </span>
            </div>
          </li>
          <li>
            <span className={styles.toolIcon}>🔍</span>
            <div>
              <strong>Search</strong>
              <span className={styles.toolDesc}>
                Searches internal knowledge — web search is coming in a future
                update
              </span>
            </div>
          </li>
          <li>
            <span className={styles.toolIcon}>🧠</span>
            <div>
              <strong>Memory</strong>
              <span className={styles.toolDesc}>
                Remembers context from your previous conversations
              </span>
            </div>
          </li>
        </ul>
        <button className={styles.button} onClick={onClose}>
          Got it
        </button>
        <p className={styles.notice}>
          ⚡ This app runs on a free server — the first response may take a
          moment to wake up.
        </p>
      </div>
    </div>
  );
};

export default WelcomeModal;
