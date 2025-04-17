import { Message } from "@shared/types";

// Important security note: 
// This file is for DEMONSTRATION PURPOSES ONLY, for running in GitHub Pages.
// Using API keys directly in client-side code is NOT SECURE for production applications.
// Always use a backend service or serverless function to handle API keys in production.

interface AnthropicMessage {
  role: "user" | "assistant";
  content: string;
}

interface AnthropicResponse {
  id: string;
  type: string;
  role: string;
  content: Array<{
    type: string;
    text: string;
  }>;
  model: string;
  stop_reason: string | null;
  stop_sequence: string | null;
}

/**
 * A client-side implementation of Anthropic Claude API.
 * NOTE: This is for demo purposes only. In production, API calls should be handled by a server.
 */
export const anthropicClient = {
  /**
   * Send a message to the Anthropic Claude API
   */
  async sendMessage(
    message: string, 
    conversationHistory: Message[] = []
  ): Promise<{ content: string }> {
    // Convert conversation history to Anthropic message format
    const messages: AnthropicMessage[] = conversationHistory.map(msg => ({
      role: msg.type === "user" ? "user" : "assistant",
      content: msg.content
    }));
    
    // Add the current message
    messages.push({
      role: "user",
      content: message
    });

    try {
      // Make request to Anthropic API
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": import.meta.env.VITE_ANTHROPIC_API_KEY || "",
          "anthropic-version": "2023-06-01"
        },
        body: JSON.stringify({
          model: "claude-3-7-sonnet-20250219", // the newest Anthropic model is "claude-3-7-sonnet-20250219" which was released February 24, 2025
          max_tokens: 1000,
          system: "You are SchoolAssist, an educational AI assistant focused on helping students. When providing step-by-step instructions or explanations, place each step on a separate line. Format numbered steps as '1. Step one', '2. Step two', etc. For multi-part answers, use headers with # or ## for main sections. Use line breaks between sections. Use bold formatting with ** for important points. For math problems, explain each step clearly on a new line.",
          messages: messages
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `API Error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`
        );
      }

      const data = await response.json() as AnthropicResponse;
      
      // Extract the text content from the response
      if (data.content && data.content.length > 0 && 'text' in data.content[0]) {
        return { content: data.content[0].text };
      }
      
      throw new Error("Unexpected response format from API");
    } catch (error) {
      console.error("Error calling Anthropic API:", error);
      return { 
        content: "I'm sorry, I encountered an error processing your request. Please check your API key configuration or try again later."
      };
    }
  }
};