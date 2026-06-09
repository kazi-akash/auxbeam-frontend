import { useState, useCallback, useRef } from 'react';
import api from '@/lib/api/axios';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: Date;
}

interface UseChatOptions {
  /** API endpoint for the AI chat. Defaults to /api/chat */
  endpoint?: string;
}

export function useAIChat({ endpoint = '/api/chat' }: UseChatOptions = {}) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const sendMessage = useCallback(
    async (text?: string) => {
      const content = (text ?? input).trim();
      if (!content || isLoading) return;

      const userMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'user',
        content,
        createdAt: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setInput('');
      setError(null);
      setIsLoading(true);

      abortRef.current = new AbortController();

      try {
        const res = await api.post(
          endpoint,
          {
            message: content,
            history: messages.map((m) => ({ role: m.role, content: m.content })),
          },
          { signal: abortRef.current.signal },
        );

        const reply: ChatMessage = {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: res.data.data?.message ?? res.data.message ?? '',
          createdAt: new Date(),
        };

        setMessages((prev) => [...prev, reply]);
      } catch (err: any) {
        if (err.name !== 'CanceledError' && err.name !== 'AbortError') {
          setError('Something went wrong. Please try again.');
        }
      } finally {
        setIsLoading(false);
      }
    },
    [endpoint, input, isLoading, messages],
  );

  const clearMessages = useCallback(() => {
    abortRef.current?.abort();
    setMessages([]);
    setInput('');
    setError(null);
  }, []);

  return { messages, input, setInput, isLoading, error, sendMessage, clearMessages };
}
