import { Card, CardContent } from "@/components/ui/card";
import { ThumbsUp, Heart, Laugh, ThumbsDown } from "lucide-react";
import { useSocket } from "@/socket/socket";
import { useEffect } from "react";

const MessageList = ({ messages }) => {
  const { socket } = useSocket();

  const handleReact = (messageId, type) => {
    socket.emit("message:react", { messageId, reactionType: type });
  };

  const handleRead = (messageId) => {
    socket.emit("message:read", { messageId });
  };

  useEffect(() => {
    messages.forEach((msg) => {
      handleRead(msg.id); 
    });
  }, [messages]);

  return (
    <div className="h-[400px] overflow-y-auto space-y-2 p-2">
      {messages.map((msg) => (
        <Card key={msg.id} className="w-full">
          <CardContent className="p-3">
            <div className="text-sm text-muted-foreground">{new Date(msg.timestamp).toLocaleTimeString()}</div>
            
            <div className="mb-2">
              <strong className="text-primary">{msg.sender}:</strong>{" "}
              {msg.message}
            </div>

            {/* Display uploaded image if exists */}
            {msg.image && (
              <img src={msg.image} alt="Uploaded" className="w-40 h-auto rounded mb-2" />
            )}

            {/* Reactions */}
            {msg.reactions && (
              <div className="text-sm flex gap-2 mb-1">
                {Object.entries(msg.reactions).map(([type, users]) => (
                  <span key={type} className="text-xs bg-gray-100 rounded px-2 py-1">
                    {type} {users.length}
                  </span>
                ))}
              </div>
            )}

            {/* Reaction buttons */}
            <div className="flex gap-2 mt-1 text-gray-500 cursor-pointer text-sm">
              <ThumbsUp size={16} onClick={() => handleReact(msg.id, "👍")} />
              <Heart size={16} onClick={() => handleReact(msg.id, "❤️")} />
              <Laugh size={16} onClick={() => handleReact(msg.id, "😂")} />
              <ThumbsDown size={16} onClick={() => handleReact(msg.id, "👎")} />
            </div>

            {/* Read By */}
            {msg.readBy && msg.readBy.length > 0 && (
              <div className="text-xs text-gray-400 mt-1">
                Seen by: {msg.readBy.join(", ")}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default MessageList;
