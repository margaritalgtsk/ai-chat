import { useEffect, useState } from 'react';
import DevPanel from './dev/DevPanel.tsx';
import Chat from './features/chat/components/Chat.tsx';
import WelcomeModal from './features/chat/components/WelcomeModal.tsx';
import { useAuth0 } from '@auth0/auth0-react';
import { useAppDispatch } from './store/hooks.ts';
import { setAuthenticated } from './features/auth/authSlice.ts';
import { loadHistory } from './features/chat/chatSlice.ts';

function App() {
  const [showWelcome, setShowWelcome] = useState(
    () => !localStorage.getItem('hasSeenWelcome')
  );

  const { isAuthenticated, isLoading } = useAuth0();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (isLoading) return;
    dispatch(setAuthenticated(isAuthenticated));
    if (isAuthenticated) {
      dispatch(loadHistory());
    }
  }, [isAuthenticated, dispatch, isLoading]);

  const handleCloseWelcome = () => {
    localStorage.setItem('hasSeenWelcome', 'true');
    setShowWelcome(false);
  };

  return (
    <>
      <Chat />
      {showWelcome && <WelcomeModal onClose={handleCloseWelcome} />}
      {import.meta.env.VITE_MOCK_CHAT_STREAM && <DevPanel />}
    </>
  );
}

export default App;
