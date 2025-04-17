import { forwardRef } from "react";
import ChatMessage from "./ChatMessage";
import { Message } from "@shared/types";

interface ChatContainerProps {
  messages: Message[];
  isLoading: boolean;
}

const ChatContainer = forwardRef<HTMLDivElement, ChatContainerProps>(
  ({ messages, isLoading }, ref) => {
    return (
      <main className="flex-1 flex flex-col max-w-4xl mx-auto w-full px-4 md:px-6 overflow-hidden">
        {/* Welcome message */}
        {messages.length === 1 && messages[0].id === "welcome" && (
          <div className="py-6 text-center">
            <h2 className="text-lg font-medium mb-2 text-white">Welcome to SchoolAssist</h2>
            <p className="text-gray-300 text-sm max-w-md mx-auto">
              Need help with homework, studying, or research? Ask me anything academic and I'll help you learn!
            </p>
          </div>
        )}
        
        {/* Chat messages container */}
        <div 
          ref={ref}
          className="chat-container overflow-y-auto flex-1 pb-4 scrollbar-hide h-[calc(100vh-170px)] md:h-[calc(100vh-150px)]"
          style={{ scrollBehavior: "smooth" }}
        >
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          
          {/* Loading indicator */}
          {isLoading && (
            <div className="flex items-start mb-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white mr-2 flex-shrink-0">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-3-8a3 3 0 1 1 6 0 3 3 0 0 1-6 0zm2 0a1 1 0 1 0 2 0 1 1 0 0 0-2 0z"></path>
                </svg>
              </div>
              <div className="text-white p-4 rounded-lg rounded-tl-none inline-block bg-gradient-to-r from-blue-500 to-indigo-600 shadow-sm">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    );
  }
);

ChatContainer.displayName = "ChatContainer";

export default ChatContainer;
