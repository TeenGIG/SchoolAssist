import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

export default function ChatInput({ onSendMessage, isLoading }: ChatInputProps) {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const MAX_CHARS = 1000;

  // Auto-resize textarea based on content
  const autoResizeTextarea = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      const newHeight = Math.min(textarea.scrollHeight, 150);
      textarea.style.height = `${newHeight}px`;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && input.length <= MAX_CHARS && !isLoading) {
      onSendMessage(input);
      setInput("");
      
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (input.trim() && input.length <= MAX_CHARS && !isLoading) {
        handleSubmit(e);
      }
    }
  };

  // Update textarea height on input change
  useEffect(() => {
    autoResizeTextarea();
  }, [input]);

  // Get character count color class
  const getCharCountClass = () => {
    if (input.length > MAX_CHARS) {
      return "text-error";
    }
    if (input.length > MAX_CHARS * 0.9) {
      return "text-amber-500";
    }
    return "text-text-secondary";
  };

  return (
    <footer className="border-t border-gray-700 bg-black py-3 px-4 md:px-6">
      <div className="max-w-4xl mx-auto">
        <form className="flex items-end gap-2" onSubmit={handleSubmit}>
          <div className="relative flex-1">
            <textarea 
              ref={textareaRef}
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              rows={1}
              placeholder="Ask me anything..."
              className="w-full resize-none rounded-lg border border-gray-700 bg-gray-900 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 py-3 px-4 pr-16 text-sm md:text-base outline-none transition-all"
            />
            <div className="absolute bottom-2 right-2 flex items-center space-x-1">
              <span className={`text-xs ${getCharCountClass()}`}>
                {input.length}/{MAX_CHARS}
              </span>
            </div>
          </div>
          <Button 
            type="submit"
            className="rounded-lg bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 font-medium flex items-center justify-center transition-colors h-[42px] md:h-[46px]"
            disabled={input.trim() === "" || input.length > MAX_CHARS || isLoading}
          >
            <span className="sr-only md:not-sr-only md:mr-1 md:inline-block">Send</span>
            <Send className="w-5 h-5" />
          </Button>
        </form>
        <div className="mt-2 text-center text-xs text-gray-400">
          <span>SchoolAssist may produce inaccurate information • {new Date().getFullYear()}</span>
        </div>
      </div>
    </footer>
  );
}
