export interface User {
  name: string;
  email: string;
  id: string;
  role: "USER" | "ADMIN";
  photoUrl?: string | null;
}

export interface ChatMessage {
  id: string;
  fromId: string;
  chatSessionId: string;
  message: string;
  createdAt: number;
}

export interface ChatSession {
  id: string;
  users: User[];
  messages: Omit<ChatMessage, "chatSessionId">[];
  lastMessagedAt: number;
}

export interface Book {
  id: string;
  title: string;
  isbn: string;
  description: string;
  price: number;
  featuredPicture: string;
  listedById: string;
  listedOn: number;
  pictures: string[];
}
