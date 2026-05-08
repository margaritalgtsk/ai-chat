import type React from 'react';
import styles from '../../../shared/styles/Chat.module.css';
import type { ChatSession } from '../../../types';
import { useAppDispatch } from '../../../store/hooks';
import { deleteSession, selectSession } from '../chatSlice';
import { useAuth0 } from '@auth0/auth0-react';
import { useState } from 'react';

interface SidebarProps {
  sessions: ChatSession[];
  activeSessionId: string;
  createNewChat: () => void;
  isOpen?: boolean;
  onClose?: () => void;
}
const Sidebar: React.FC<SidebarProps> = ({
  sessions,
  activeSessionId,
  createNewChat,
  isOpen,
  onClose,
}) => {
  const dispatch = useAppDispatch();

  const { isAuthenticated, logout, loginWithRedirect, user } = useAuth0();

  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);

  return (
    <div className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ''}`}>
      <div className={styles.sidebarHeader}>
        <h2>Chat Sessions</h2>
        <img src="/logo.png" alt="logo" className={styles.sidebarLogo} />
        <button
          className={styles.closeSidebarButton}
          onClick={onClose}
          aria-label="Close sessions"
        >
          ×
        </button>
      </div>
      <button
        className={styles.newChatButton}
        onClick={() => {
          createNewChat();
          onClose?.();
        }}
      >
        New Session
      </button>
      <div className={styles.sessionList}>
        {sessions.map((session) => (
          <div
            key={session.id}
            onClick={() => {
              dispatch(selectSession(session.id));
              onClose?.();
            }}
            className={`${styles.sessionItem} ${session.id === activeSessionId ? styles.activeSession : ''}`}
          >
            <span>
              {session.title ??
                session.messages[0]?.content.slice(0, 20) ??
                'Current Session'}
            </span>
            <button
              className={styles.sessionMenuButton}
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpenId(menuOpenId === session.id ? null : session.id);
              }}
              aria-label="Session menu"
            >
              ⋮
            </button>
            {menuOpenId === session.id && (
              <div className={styles.sessionMenu}>
                <button
                  className={styles.sessionMenuDelete}
                  onClick={(e) => {
                    e.stopPropagation();
                    dispatch(deleteSession(session.id));
                    setMenuOpenId(null);
                  }}
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
      {isAuthenticated ? (
        <>
          <div className={styles.userInfo}>
            {user?.picture && (
              <img
                src={user.picture}
                alt={user.name}
                className={styles.userAvatar}
              />
            )}
            <span className={styles.userName}>{user?.name ?? user?.email}</span>
          </div>
          <button
            className={styles.logoutButton}
            onClick={() =>
              logout({ logoutParams: { returnTo: window.location.origin } })
            }
          >
            Logout
          </button>
        </>
      ) : (
        <button
          className={styles.signinButton}
          onClick={() => loginWithRedirect()}
          data-tooltip="Sign in to save chat history"
        >
          Sign in
        </button>
      )}
    </div>
  );
};

export default Sidebar;
