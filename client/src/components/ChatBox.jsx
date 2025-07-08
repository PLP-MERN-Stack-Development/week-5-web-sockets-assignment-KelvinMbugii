import { useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Paperclip, Send } from "lucide-react";
import axios from "axios";

const ChatBox = ({ value, onChange, onSend }) => {
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post("http://localhost:5000/api/uploads", formData);
      onSend(res.data.fileUrl); 
    } catch (err) {
      console.error("Upload failed", err);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onSend()}
        placeholder="Type your message..."
        className="flex-1"
      />
      <Button variant="outline" onClick={() => fileInputRef.current.click()}>
        <Paperclip size={18} />
      </Button>
      <input
        ref={fileInputRef}
        type="file"
        hidden
        accept="image/*"
        onChange={handleFileChange}
      />
      <Button onClick={onSend}>
        <Send size={18} />
      </Button>
    </div>
  );
};

export default ChatBox;
