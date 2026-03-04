import { useState } from 'react';
import { useActiveStreams } from './useActiveStreams';
import styles from '../shared/styles/DevPanel.module.css';

export const DevPanel = () => {
  const streams = useActiveStreams();
  const date = new Date();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={styles.devPanel}>
      <div className={styles.header}>
        <h4>Active streams: {streams.length}</h4>
        <button
          type="button"
          className={styles.closeButton}
          onClick={() => setCollapsed((prev) => !prev)}
          aria-label={collapsed ? 'Expand dev panel' : 'Collapse dev panel'}
          title={collapsed ? 'Expand' : 'Collapse'}
        >
          {collapsed ? '+' : '×'}
        </button>
      </div>

      {!collapsed &&
        streams.map((s) => (
          <div key={s.correlationId} className={styles.stream}>
            <div>session: {s.sessionId}</div>
            <div>message: {s.messageId}</div>
            <div>retry: {s.retryAttempt}</div>
            <div>status: {s.status || 'active'}</div>
            <div>
              alive for:{' '}
              {Math.round(((s.endedAt ?? date.getTime()) - s.startedAt) / 1000)}
              s
            </div>
          </div>
        ))}
    </div>
  );
};

export default DevPanel;
