import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const ChatBox = ({ value, onChange, onSend }) => (
    <div className="flex gap-2 mt-4">
        <Input
            value={value}
            onChange = {(e) => onChange(e.target.value)}
            onKeyDown = {(e) => e.key === "Enter" && onSend()}
            placeholder = "Type your message..."
            className = "flex-1"
        />
        <Button onClick={onSend}>Send</Button>
    </div>
);

export default ChatBox;