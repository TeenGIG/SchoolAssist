import { useState, useEffect, useRef } from "react";
import ChatHeader from "@/components/chat/ChatHeader";
import ChatContainer from "@/components/chat/ChatContainer";
import ChatInput from "@/components/chat/ChatInput";
import { Message } from "@shared/types";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const chatMutation = useMutation({
    mutationFn: async (message: string) => {
      // Get conversation history (last 4 messages excluding welcome)
      const contextMessages = messages
        .filter(msg => msg.id !== "welcome")
        .slice(-4); 
      
      // Send message with conversation context
      const response = await apiRequest("POST", "/api/chat", { 
        message,
        conversationHistory: contextMessages
      });
      return response.json();
    },
    onSuccess: (data) => {
      setMessages(prev => [...prev, data]);
      setIsLoading(false);
    },
    onError: (error) => {
      setIsLoading(false);
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to get AI response: ${error.message}`
      });
    }
  });

  const handleSendMessage = (message: string) => {
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
    
    // Send message to AI
    chatMutation.mutate(message);
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
