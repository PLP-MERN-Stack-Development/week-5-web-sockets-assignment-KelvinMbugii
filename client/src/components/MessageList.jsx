import { Card, CardContent } from "@/components/ui/card";

const MessageList = ({ messages }) => {
    return(
        <div className = "h-[400px] overflow-y-auto space-y-2 p-2">
            {messages.map((msg) =>(
                <Card key={msg.id} className="w-full">
                    <CardContent className="p-3">
                        <div className="text-sm text-muted-foreground">{msg.timestamp}</div>
                        <div>
                            <strong className="text-primary">{msg.sender}:</strong>{" "}
                            {msg.message}
                        </div>
                        </CardContent>
                        </Card>
            ))}

        </div>
    );
};

export default MessageList;