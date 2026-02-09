export type MessageStatus =
  | 'idle'
  | 'streaming'
  | 'retrying'
  | 'abort'
  | 'error';

export type ChatErrorType = 'abort' | 'network' | 'server' | 'unknown';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  status?: MessageStatus;
  retry?: {
    attempt: number;
    max: number;
  };
  errorType?: ChatErrorType;
  correlationId?: string;
}

export interface ChatSession {
  id: string;
  messages: Message[];
}
