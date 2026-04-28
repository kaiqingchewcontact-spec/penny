import { useState, useCallback } from 'react';

export interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  text: string;
  timestamp: number;
}

export function useChatHistory() {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem('penny_chat');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  const append = useCallback((msg: ChatMessage) => {
    setMessages(prev => {
      const next = [...prev, msg];
      const trimmed = next.length > 100 ? next.slice(-100) : next;
      try { localStorage.setItem('penny_chat', JSON.stringify(trimmed)); } catch {}
      return trimmed;
    });
  }, []);

  const clear = useCallback(() => {
    setMessages([]);
    try { localStorage.removeItem('penny_chat'); } catch {}
  }, []);

  return { messages, append, setMessages, clear };
}
