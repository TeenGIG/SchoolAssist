import { useState, useEffect } from "react";
import { Message } from "@shared/types";

interface ChatMessageProps {
  message: Message;
}

const formatAIResponse = (text: string) => {
  // Convert URLs to links
  let formattedText = text.replace(
    /(https?:\/\/[^\s]+)/g, 
    '<a href="$1" target="_blank" class="underline hover:text-blue-100 transition-colors">$1</a>'
  );
  
  // Format markdown-like elements
  // Bold
  formattedText = formattedText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  
  // Italic
  formattedText = formattedText.replace(/\*(.*?)\*/g, '<em>$1</em>');
  
  // Format headers with added margins
  formattedText = formattedText.replace(/^# (.*?)$/gm, '<h1 class="font-bold text-xl my-3">$1</h1>');
  formattedText = formattedText.replace(/^## (.*?)$/gm, '<h2 class="font-bold text-lg my-2">$1</h2>');
  formattedText = formattedText.replace(/^### (.*?)$/gm, '<h3 class="font-bold text-md my-2">$1</h3>');
  
  // Format numbered lists - detect numbered patterns like "1. Step one"
  formattedText = formattedText.replace(
    /^\d+\.\s+(.*?)$/gm, 
    '<div class="py-1 flex"><span class="mr-2 font-bold">•</span><span>$1</span></div>'
  );
  
  // Format bulleted lists
  formattedText = formattedText.replace(
    /^[-*]\s+(.*?)$/gm,
    '<div class="py-1 flex"><span class="mr-2">•</span><span>$1</span></div>'
  );
  
  // Format "Step X:" pattern with better spacing and emphasis
  formattedText = formattedText.replace(
    /^(Step \d+:)(.*?)$/gm,
    '<div class="py-2"><strong class="text-blue-300">$1</strong>$2</div>'
  );
  
  // Handle code blocks with better styling
  formattedText = formattedText.replace(
    /```([\s\S]*?)```/g,
    '<pre class="bg-gray-800 p-3 my-2 rounded-md overflow-auto text-sm font-mono">$1</pre>'
  );
  
  // Inline code with better styling
  formattedText = formattedText.replace(
    /`([^`]+)`/g,
    '<code class="bg-gray-800 px-1 py-0.5 rounded font-mono text-blue-200">$1</code>'
  );
  
  // Handle single line breaks (convert to <br> for better readability of steps)
  formattedText = formattedText.replace(/\n(?!\n)/g, '<br />');
  
  // Convert double line breaks to paragraph breaks with proper spacing
  const paragraphs = formattedText.split('\n\n');
  if (paragraphs.length > 1) {
    return paragraphs.map(p => {
      if (p.trim() === '') return '';
      
      // Check if it's a list - preserving the list formatting we did above
      if (p.includes('<div class="py-')) {
        return p;
      }
      
      return `<p class="my-2">${p}</p>`;
    }).join('');
  }
  
  return formattedText;
};

export default function ChatMessage({ message }: ChatMessageProps) {
  const [showAnimation, setShowAnimation] = useState(true);
  
  // Effect to control animation timing
  useEffect(() => {
    // Short timeout to ensure the animation plays
    const timer = setTimeout(() => {
      setShowAnimation(false);
    }, 3000); // Duration of typing animation
    
    return () => clearTimeout(timer);
  }, []);

  if (message.type === "user") {
    return (
      <div className="flex items-start mb-4 justify-end fade-in">
        <div className="bg-gray-800 p-3 rounded-lg rounded-tr-none max-w-[85%] shadow-sm text-white text-appear">
          <p>{message.content}</p>
        </div>
        <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-gray-300 ml-2 flex-shrink-0">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-4c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"></path>
          </svg>
        </div>
      </div>
    );
  } else {
    return (
      <div className="flex items-start mb-4 fade-in">
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white mr-2 flex-shrink-0">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-3-8a3 3 0 1 1 6 0 3 3 0 0 1-6 0zm2 0a1 1 0 1 0 2 0 1 1 0 0 0-2 0z"></path>
          </svg>
        </div>
        <div className="text-white p-3 rounded-lg rounded-tl-none max-w-[85%] bg-gradient-to-r from-blue-500 to-indigo-600 shadow-sm">
          <div 
            className={showAnimation ? "typewriter" : ""}
            dangerouslySetInnerHTML={{ __html: formatAIResponse(message.content) }} 
          />
        </div>
      </div>
    );
  }
}
