'use client';

import { useEffect, useRef, useState } from 'react';
import { MessageCircle, X, Send, Bot, RotateCcw } from 'lucide-react';
import { useAIChat } from '@/lib/hooks/useAIChat';

export function AIChatbot() {
  const [open, setOpen] = useState(false);
  const { messages, input, setInput, isLoading, error, sendMessage, clearMessages } = useAIChat();
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom on new message
  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  // Focus input when opened
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100);
  }, [open]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Floating toggle button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[#FCE32D] text-black shadow-lg flex items-center justify-center hover:scale-105 transition-transform"
        aria-label={open ? 'Close chat' : 'Open AI assistant'}
      >
        {open ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 flex flex-col bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="flex items-center gap-2 px-4 py-3 bg-[#FCE32D]">
            <Bot className="w-5 h-5 text-black" />
            <span className="font-semibold text-black text-sm">AuxBeam Assistant</span>
            <button
              onClick={clearMessages}
              className="ml-auto text-black/60 hover:text-black transition-colors"
              aria-label="Clear conversation"
              title="Clear conversation"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-80 min-h-[12rem]">
            {messages.length === 0 && (
              <p className="text-center text-sm text-gray-400 mt-8">
                Hi! Ask me anything about products, orders, or shipping.
              </p>
            )}

            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[75%] rounded-xl px-3 py-2 text-sm leading-relaxed whitespace-pre-wrap ${
                    msg.role === 'user'
                      ? 'bg-[#FCE32D] text-black rounded-br-sm'
                      : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-xl rounded-bl-sm px-3 py-2">
                  <span className="flex gap-1 items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce [animation-delay:0ms]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce [animation-delay:150ms]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce [animation-delay:300ms]" />
                  </span>
                </div>
              </div>
            )}

            {error && (
              <p className="text-center text-xs text-red-500">{error}</p>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="flex items-center gap-2 px-3 py-2 border-t border-gray-100">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message…"
              disabled={isLoading}
              className="flex-1 text-sm bg-gray-50 rounded-lg px-3 py-2 outline-none border border-gray-200 focus:border-[#FCE32D] transition-colors disabled:opacity-50"
            />
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || isLoading}
              className="w-9 h-9 rounded-lg bg-[#FCE32D] text-black flex items-center justify-center hover:bg-yellow-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              aria-label="Send"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
