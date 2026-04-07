// 消息类型
export interface Message {
  id: string;
  content: string;
  role: 'user' | 'ai';
  timestamp: string;
  model?: string;
}

// API 响应类型
export interface ApiResponse {
  response: string;
  timestamp: string;
  model: string;
  error?: boolean;
}

// 主题类型
export type Theme = 'light' | 'dark';

// 通知类型
export interface Notification {
  id: string;
  message: string;
  type: 'info' | 'success' | 'error';
  duration?: number;
}

// 服务器状态
export type ServerStatus = 'connected' | 'disconnected' | 'checking';