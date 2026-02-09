import { useActiveStreams } from './useActiveStreams';
import styles from '../shared/styles/DevPanel.module.css';

export const DevPanel = () => {
  const streams = useActiveStreams();
  const date = new Date();

  return (
    <div className={styles.devPanel}>
      <h4>Active streams: {streams.length}</h4>

      {streams.map((s) => (
        <div key={s.correlationId}>
          <div>session: {s.sessionId}</div>
          <div>message: {s.messageId}</div>
          <div>retry: {s.retryAttempt}</div>
          <div>
            alive for: {Math.round((date.getTime() - s.startedAt) / 1000)}s
          </div>
        </div>
      ))}
    </div>
  );
};

export default DevPanel;
