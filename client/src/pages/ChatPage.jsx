import React, { useEffect, useState } from "react";
import { useSocket } from "@/socket/socket";
import MessageList from "@/components/MessageList";
import ChatBox from "@/components/ChatBox";
import TypingIndicator from "@/components/TypingIndicator";
import UserList from "@/components/UserList";

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
        if(username){
            connect(username);
        }
    }, [username]);

    const handleSend =() => {
        if (input.trim()){
            sendMessage(input);
            setInput("");
        }
    };

    return(
        <div className="grid grid-cols-1 md:grid-cols-4 h-screen p-4 gap-4 bg-background text-foreground">
            <div className="md:col-span-3 flex flex-col">
                <MessageList messages = {messages}/>
                <TypingIndicator users = {typingUsers}/>
                <ChatBox
                    value={input}
                    onChange = {setInput}
                    onSend = {handleSend}
                />

            </div>
            <div>
                <UserList users = {users}/>
            </div>

        </div>
    );
};

export default ChatPage;