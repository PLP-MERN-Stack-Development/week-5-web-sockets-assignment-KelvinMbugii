import { useState } from "react";
import ChatPage from "@/pages/ChatPage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";

function App() {
  const [username, setUsername] = useState(null);
  const [isRegistering, setIsRegistering] = useState(false);

  if (username) return <ChatPage username={username}/>;

  return isRegistering ? (
    <RegisterPage onRegister={setUsername} switchToLogin={() => setIsRegistering(false)} />
  ) : (
    <LoginPage onLogin={setUsername} switchToRegister={() => setIsRegistering(true)} />
  );
}

export default App;
