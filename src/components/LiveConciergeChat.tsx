import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { MessageSquare, Send, X, Shield, Clock, Check, Sparkles } from 'lucide-react';

interface LiveConciergeChatProps {
  messages: ChatMessage[];
  onSendMessage: (text: string, sender: 'client' | 'concierge') => void;
  isOpen: boolean;
  onToggle: () => void;
}

export const LiveConciergeChat: React.FC<LiveConciergeChatProps> = ({
  messages,
  onSendMessage,
  isOpen,
  onToggle
}) => {
  const [inputText, setInputText] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userText = inputText.trim();
    onSendMessage(userText, 'client');
    setInputText('');

    // Trigger concierge auto-assistance if admin isn't actively typing
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      let reply = 'Thank you for reaching the PRYZM Studio. Our casting directors have received your dispatch and are reviewing the architectural drawings.';
      const lower = userText.toLowerCase();
      if (lower.includes('order') || lower.includes('prz-') || lower.includes('track')) {
        reply = 'Regarding your consignment, you can track current curing and specialized freight progress in real-time via the "Track Order" link in your top bar.';
      } else if (lower.includes('water') || lower.includes('stain') || lower.includes('care')) {
        reply = 'All PRYZM architectural vessels are impregnated with a breathable fluoropolymer sealant. Wipe clean with mild soap and water; avoid harsh acidic cleaners.';
      } else if (lower.includes('bespoke') || lower.includes('dimension') || lower.includes('custom')) {
        reply = 'Our bespoke configurator allows parametric tailoring up to 90cm height. For custom architectural installations exceeding 100kg, we provide custom steel-reinforced structural molds.';
      }
      onSendMessage(reply, 'concierge');
    }, 1400);
  };

  const handleQuickPrompt = (prompt: string) => {
    setInputText(prompt);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {/* Floating Concierge Trigger Button */}
      {!isOpen && (
        <button
          type="button"
          onClick={onToggle}
          className="group relative flex items-center gap-2.5 px-4 py-3 bg-[#18191e] hover:bg-[#22242a] text-white rounded-full border border-neutral-700 shadow-2xl transition-all hover:scale-105 active:scale-95"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#c5a880] opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#c5a880]" />
          </span>
          <MessageSquare className="w-4 h-4 text-[#c5a880]" />
          <span className="text-xs font-medium tracking-wide">Studio Concierge</span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="w-[340px] sm:w-[380px] h-[500px] bg-[#141518] rounded-xl border border-neutral-800 shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          
          {/* Header */}
          <div className="p-4 bg-[#191a20] border-b border-neutral-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#c5a880]/20 border border-[#c5a880]/40 flex items-center justify-center text-[#c5a880] text-xs font-serif-brand font-bold">
                P
              </div>
              <div>
                <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                  <span>PRYZM Studio Concierge</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                </div>
                <div className="text-[10px] text-neutral-400">Chief Casting Director & Freight Specialist</div>
              </div>
            </div>

            <button
              onClick={onToggle}
              className="p-1 text-neutral-400 hover:text-white rounded hover:bg-neutral-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#0f1013]">
            {messages.map((msg) => {
              const isClient = msg.sender === 'client';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isClient ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-lg p-3 text-xs leading-relaxed ${
                      isClient
                        ? 'bg-[#c5a880] text-black font-medium'
                        : 'bg-[#1e2026] text-neutral-200 border border-neutral-800'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[9px] text-neutral-500 font-mono-spec mt-1 px-1">
                    {msg.timestamp}
                  </span>
                </div>
              );
            })}

            {isTyping && (
              <div className="flex items-center gap-1 text-[11px] text-neutral-400 bg-[#1e2026] p-2 rounded-lg max-w-[120px] border border-neutral-800">
                <span className="w-1.5 h-1.5 rounded-full bg-[#c5a880] animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#c5a880] animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#c5a880] animate-bounce [animation-delay:0.4s]" />
                <span className="ml-1 text-[10px]">Consulting...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          <div className="p-2 bg-[#141518] border-t border-neutral-800/80 flex gap-1.5 overflow-x-auto text-[10px] text-neutral-400">
            <button
              type="button"
              onClick={() => handleQuickPrompt('How does Cash on Delivery work for concrete decor?')}
              className="px-2 py-1 rounded bg-[#1c1d23] hover:bg-[#252830] text-neutral-300 border border-neutral-800 whitespace-nowrap"
            >
              COD Logistics
            </button>
            <button
              type="button"
              onClick={() => handleQuickPrompt('Can you cast a bespoke 80cm pedestal?')}
              className="px-2 py-1 rounded bg-[#1c1d23] hover:bg-[#252830] text-neutral-300 border border-neutral-800 whitespace-nowrap"
            >
              Custom Dimension
            </button>
            <button
              type="button"
              onClick={() => handleQuickPrompt('Are these vessels water resistant?')}
              className="px-2 py-1 rounded bg-[#1c1d23] hover:bg-[#252830] text-neutral-300 border border-neutral-800 whitespace-nowrap"
            >
              Water Sealing
            </button>
          </div>

          {/* Input Bar */}
          <form onSubmit={handleSend} className="p-3 bg-[#191a20] border-t border-neutral-800 flex gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Inquire with casting concierge..."
              className="flex-1 bg-[#121316] border border-neutral-700 focus:border-[#c5a880] rounded px-3 py-2 text-xs text-white placeholder-neutral-500 outline-none"
            />
            <button
              type="submit"
              className="p-2 bg-[#c5a880] hover:bg-[#b89a70] text-black rounded transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>

        </div>
      )}
    </div>
  );
};
