import { useState } from 'react';
import DevPanel from './dev/DevPanel.tsx';
import Chat from './features/chat/components/Chat.tsx';
import WelcomeModal from './features/chat/components/WelcomeModal.tsx';

function App() {
  const [showWelcome, setShowWelcome] = useState(
    () => !localStorage.getItem('hasSeenWelcome')
  );

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
