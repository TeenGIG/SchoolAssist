export interface Message {
  id: string;
  content: string;
  type: "user" | "ai";
  timestamp: string;
}

export interface ChatResponse {
  id: string;
  content: string;
  type: "ai";
  timestamp: string;
}
