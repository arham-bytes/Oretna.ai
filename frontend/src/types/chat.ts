export interface Source {
  title: string;
  year?: string;
  url?: string;
  doi?: string;
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  file?: string | null;
  sources?: Source[];
  keyFindings?: string[];
}

export interface Conversation {
  id: string;
  title: string;
  fullTitle?: string;
  subtitle?: string;
  messages: Message[];
}

export interface GroupedConversations {
  today: Conversation[];
  yesterday: Conversation[];
  previous: Conversation[];
}
