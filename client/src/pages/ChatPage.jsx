import React, { useEffect, useState } from "react";
import { useSocket } from "@/socket/socket";
import MessageList from "@/components/MessageList";
import ChatBox from "@/components/ChatBox";
import TypingIndicator from "@/components/TypingIndicator";
import UserList from "@/components/UserList";
//import ThemeToggle from "@/components/ThemeToggle";

const ChatPage = ({ username }) => {
  const [input, setInput] = useState("");
  const {
    messages,
    users,
    typingUsers,
    connect,
    sendMessage,
    setTyping,
  } = useSocket();

  useEffect(() => {
    if (username) {
      connect(username);
    }
  }, [username]);

  const handleSend = () => {
    if (input.trim()) {
      sendMessage(input);
      setInput("");
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 h-screen p-4 gap-4 bg-background text-foreground">
      {/* Chat Panel */}
      <div className="md:col-span-3 flex flex-col bg-white rounded shadow">
        {/* Message list with scroll */}
        <div className="flex-1 overflow-y-auto p-2">
          <MessageList messages={messages} />
        </div>

        <div className="p-2">
          <TypingIndicator users={typingUsers} />
        </div>

        {/* Chat input */}
        <div className="border-t p-2">
          <ChatBox value={input} onChange={setInput} onSend={handleSend} />
        </div>
      </div>

      {/* Online users */}
      <div className="bg-white rounded shadow p-4">
        <UserList users={users} />
      </div>
    </div>
  );
};

export default ChatPage;
