import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface ChatHeaderProps {
  onClearChat: () => void;
}

export default function ChatHeader({ onClearChat }: ChatHeaderProps) {
  return (
    <header className="border-b border-gray-700 bg-black shadow-sm py-4 px-4 md:px-6">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <svg 
            className="w-8 h-8 text-primary mr-2" 
            fill="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-6c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm-3-1h6v2H9v-2z" />
          </svg>
          <h1 className="text-xl font-semibold text-white">SchoolAssist</h1>
        </div>
        <div className="flex items-center">
          <div className="flex items-center mr-4">
            <span className="h-2 w-2 rounded-full bg-green-400 mr-1"></span>
            <span className="text-sm text-gray-300">Online</span>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onClearChat}
            className="text-sm text-gray-300 hover:text-white transition-colors flex items-center border-gray-700"
          >
            <Trash2 className="w-4 h-4 mr-1" />
            Clear chat
          </Button>
        </div>
      </div>
    </header>
  );
}
