import { type Message } from "@shared/types";

// Define the storage interface
export interface IStorage {
  getMessages(): Promise<Message[]>;
  addMessage(message: Omit<Message, "id">): Promise<Message>;
  clearMessages(): Promise<void>;
}

// In-memory storage implementation
export class MemStorage implements IStorage {
  private messages: Message[];
  private nextId: number;

  constructor() {
    this.messages = [];
    this.nextId = 1;
  }

  async getMessages(): Promise<Message[]> {
    return [...this.messages];
  }

  async addMessage(message: Omit<Message, "id">): Promise<Message> {
    const id = this.nextId.toString();
    this.nextId++;

    const newMessage: Message = {
      ...message,
      id,
    };

    this.messages.push(newMessage);
    return newMessage;
  }

  async clearMessages(): Promise<void> {
    this.messages = [];
  }
}

// Export an instance of the storage
export const storage = new MemStorage();
