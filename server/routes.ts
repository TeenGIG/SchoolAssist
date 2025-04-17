import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import Anthropic from "@anthropic-ai/sdk";

// Initialize Anthropic with API key
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "", // From environment variables
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Chat endpoint
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, conversationHistory } = req.body;
      
      if (!message || typeof message !== "string") {
        return res.status(400).json({ message: "Invalid message format" });
      }

      // Prepare conversation messages
      const messages = [];
      
      // Add conversation history if available
      if (Array.isArray(conversationHistory) && conversationHistory.length > 0) {
        // Convert messages to the format expected by Anthropic API
        for (const msg of conversationHistory) {
          if (msg && msg.type && msg.content) {
            messages.push({
              role: msg.type === "user" ? "user" : "assistant",
              content: msg.content
            });
          }
        }
      }
      
      // Add current user message
      messages.push({ role: "user", content: message });

      // Get AI response
      const response = await anthropic.messages.create({
        model: "claude-3-7-sonnet-20250219", // the newest Anthropic model is "claude-3-7-sonnet-20250219" which was released February 24, 2025
        max_tokens: 1000,
        system: "You are SchoolAssist, an educational AI assistant focused on helping students. When providing step-by-step instructions or explanations, place each step on a separate line. Format numbered steps as '1. Step one', '2. Step two', etc. For multi-part answers, use headers with # or ## for main sections. Use line breaks between sections. Use bold formatting with ** for important points. For math problems, explain each step clearly on a new line.",
        messages: messages,
      });

      // Get the text content from the response
      let aiMessage = "Sorry, I couldn't generate a response.";
      
      // Safe extraction of text content from the response
      if (response.content && 
          response.content.length > 0 && 
          'text' in response.content[0]) {
        aiMessage = response.content[0].text;
      }
      
      // Store the message (in-memory only for this implementation)
      const storedMessage = await storage.addMessage({
        content: aiMessage,
        type: "ai",
        timestamp: new Date().toISOString(),
      });

      // Return the AI response
      return res.status(200).json({
        id: Date.now().toString(), // Generate a unique ID
        content: aiMessage,
        type: "ai",
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error processing chat:", error);
      return res.status(500).json({ 
        message: `Error generating AI response: ${error instanceof Error ? error.message : String(error)}` 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
