import { useState, useEffect, useRef } from "react";
import ChatHeader from "@/components/chat/ChatHeader";
import ChatContainer from "@/components/chat/ChatContainer";
import ChatInput from "@/components/chat/ChatInput";
import { Message } from "@shared/types";
import { useToast } from "@/hooks/use-toast";
import { anthropicClient } from "@/lib/anthropicClient";

/**
 * This is a special version of Home.tsx that works without a backend server
 * for GitHub Pages deployment. It calls the Anthropic API directly.
 * 
 * IMPORTANT: This approach should NOT be used in production as it exposes
 * your API key in client-side code. It is provided only for demonstration.
 */
export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return;
    
    // Add user message to chat
    const userMessage: Message = {
      id: Date.now().toString(),
      content: message,
      type: "user",
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    
    try {
      // Get conversation history (last 4 messages excluding welcome)
      const contextMessages = messages
        .filter(msg => msg.id !== "welcome")
        .slice(-4);
      
      // Call API directly
      const { content } = await anthropicClient.sendMessage(message, contextMessages);
      
      // Create AI response
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content,
        type: "ai",
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to get AI response: ${error instanceof Error ? error.message : String(error)}`
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([]);
    
    // Add welcome message
    const welcomeMessage: Message = {
      id: "welcome",
      content: "Hello! I'm SchoolAssist, your AI learning companion. I'm here to help with your studies, homework, and answer any academic questions. What would you like to learn today?",
      type: "ai",
      timestamp: new Date().toISOString()
    };
    setMessages([welcomeMessage]);
  };

  // Initialize chat with welcome message
  useEffect(() => {
    handleClearChat();
  }, []);

  // Display a warning if API key is missing
  useEffect(() => {
    if (!import.meta.env.VITE_ANTHROPIC_API_KEY) {
      toast({
        variant: "destructive",
        title: "API Key Missing",
        description: "Anthropic API key is not configured. Please set VITE_ANTHROPIC_API_KEY in your environment."
      });
    }
  }, [toast]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  return (
    <div className="flex flex-col h-screen bg-black text-white">
      <ChatHeader onClearChat={handleClearChat} />
      <ChatContainer 
        messages={messages} 
        isLoading={isLoading} 
        ref={chatContainerRef}
      />
      <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
    </div>
  );
}