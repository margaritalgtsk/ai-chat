import DevPanel from './dev/DevPanel.tsx';
import Chat from './features/chat/components/Chat.tsx';

function App() {
  return (
    <>
      <Chat />
      {import.meta.env.VITE_MOCK_CHAT_STREAM && <DevPanel />}
    </>
  );
}

export default App;
