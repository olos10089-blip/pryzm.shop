import React, { useState } from 'react';
import { ChatMessage, CallbackRequest } from '../types';
import { 
  Headphones, MessageSquare, Bot, PhoneCall, Send, 
  Clock, CheckCircle, ArrowRight, ShieldCheck, X, Sparkles, HelpCircle 
} from 'lucide-react';

interface MultiChannelSupportModalProps {
  isOpen: boolean;
  onClose: () => void;
  adminMessages: ChatMessage[];
  onSendAdminMessage: (text: string) => void;
  onRequestCallback: (req: CallbackRequest) => void;
}

export const MultiChannelSupportModal: React.FC<MultiChannelSupportModalProps> = ({
  isOpen,
  onClose,
  adminMessages,
  onSendAdminMessage,
  onRequestCallback
}) => {
  const [activeChannel, setActiveChannel] = useState<'menu' | 'admin' | 'ai' | 'call'>('menu');

  // Channel 1: Admin chat input
  const [adminInput, setAdminInput] = useState<string>('');

  // Channel 2: AI Assistant state
  const [aiChatHistory, setAiChatHistory] = useState<{ sender: 'user' | 'ai'; text: string; time: string }[]>([
    {
      sender: 'ai',
      text: 'Greetings. I am the PRYZM Architectural AI Assistant. I can provide instant technical guidance regarding our concrete aggregate mixes, product dimensions, 7-day hydration curing, international pallet shipping fees, and Cash on Delivery logistics. How can I assist you?',
      time: 'Just now'
    }
  ]);
  const [aiInput, setAiInput] = useState<string>('');
  const [isAiThinking, setIsAiThinking] = useState<boolean>(false);

  // Channel 3: Request a Call state
  const [callFullName, setCallFullName] = useState<string>('');
  const [callPhone, setCallPhone] = useState<string>('');
  const [callPreferredTime, setCallPreferredTime] = useState<string>('Afternoon (12:00 PM – 4:00 PM)');
  const [callTopic, setCallTopic] = useState<string>('');
  const [callSubmitted, setCallSubmitted] = useState<boolean>(false);

  if (!isOpen) return null;

  // AI Knowledge Answer Engine
  const handleAiSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiInput.trim()) return;

    const userQuery = aiInput.trim();
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setAiChatHistory((prev) => [...prev, { sender: 'user', text: userQuery, time: now }]);
    setAiInput('');
    setIsAiThinking(true);

    setTimeout(() => {
      setIsAiThinking(false);
      let answer = '';
      const q = userQuery.toLowerCase();

      if (q.includes('cod') || q.includes('cash') || q.includes('pay') || q.includes('delivery')) {
        answer = 'PRYZM operates under a strict Cash on Delivery (COD) exclusivity model. We never charge cards online. A specialized freight courier will deliver your heavy concrete artwork directly to your doorstep. You inspect the item in person to verify structural integrity, and hand physical cash in your local currency to the courier.';
      } else if (q.includes('ship') || q.includes('freight') || q.includes('crate') || q.includes('cost')) {
        answer = 'Because architectural concrete has a density of ~2.35 g/cm³, orders exceeding 15kg are encased in certified ISPM-15 heat-treated shock-damped timber crates. Freight tariffs are calculated dynamically by gross weight and destination country. Orders over $450 USD within standard weight tiers unlock complimentary global freight.';
      } else if (q.includes('water') || q.includes('stain') || q.includes('seal') || q.includes('clean') || q.includes('care')) {
        answer = 'All PRYZM vessels are impregnated with a breathable fluoropolymer hydrophobic sealant. They resist water, olive oil, and botanical moisture while maintaining their tactile matte stone texture. To clean, wipe with a soft micro-fiber cloth and lukewarm water with mild soap. Avoid acidic solvents (vinegar or bleach).';
      } else if (q.includes('weight') || q.includes('heavy') || q.includes('dimension') || q.includes('pedestal')) {
        answer = 'Our items feature authentic physical weights: Vessel No. IV is 4.8 kg, the Aethel Table Monolith is 7.2 kg, Caelum Valet Platter is 3.1 kg, and the Kratos Monolith Pedestal is 28.5 kg (reinforced with internal steel rebar to safely hold up to 200 kg). Custom pieces can be configured up to 90 cm in height.';
      } else if (q.includes('return') || q.includes('refund') || q.includes('damage') || q.includes('crack')) {
        answer = 'In the rare event that an item exhibits transit micro-fracturing or dimensional discrepancy, you may submit a Refund Request directly through your order tracking portal once marked "Delivered". Our studio coordinates courier pickup and full cash reimbursement or a priority replacement casting.';
      } else if (q.includes('custom') || q.includes('bespoke') || q.includes('engrav')) {
        answer = 'Our Bespoke Parametric Configurator allows you to choose from 5 architectural forms, 5 mineral pigments (Basalt, Brutalist Grey, Alabaster Chalk, Terracotta, Obsidian), 4 surface aggregate textures, and laser-engrave custom Roman Serif, Brutalist, or Mono inscriptions.';
      } else {
        answer = `Regarding "${userQuery}": All PRYZM pieces are handcrafted from high-density quartz micro-cement with 7-day hydration curing in Munich and regional studios. If you require tailored architectural drafting or consignment scheduling, you can also select "Chat with Administration" or "Request a Call" from this menu.`;
      }

      setAiChatHistory((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: answer,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }, 900);
  };

  const handleAdminSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminInput.trim()) return;
    onSendAdminMessage(adminInput.trim());
    setAdminInput('');
  };

  const handleCallbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!callPhone.trim() || !callFullName.trim()) return;

    const req: CallbackRequest = {
      id: `cb-${Date.now()}`,
      fullName: callFullName.trim(),
      phone: callPhone.trim(),
      preferredTime: callPreferredTime,
      topic: callTopic.trim() || 'General Consignment & Architectural Inquiry',
      requestedAt: new Date().toLocaleString(),
      status: 'pending'
    };

    onRequestCallback(req);
    setCallSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-5">
      <div className="relative w-full max-w-2xl bg-[#141518] rounded-xl border border-neutral-800 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Top Header */}
        <div className="p-5 sm:p-6 bg-[#17181c] border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#c5a880]/15 border border-[#c5a880]/30 flex items-center justify-center text-[#c5a880]">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono-spec tracking-widest uppercase text-[#c5a880]">
                MULTI-CHANNEL CONCIERGE & SUPPORT
              </span>
              <h2 className="font-serif-brand text-xl sm:text-2xl font-bold text-white">
                Report an Issue / Client Support
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {activeChannel !== 'menu' && (
              <button
                type="button"
                onClick={() => setActiveChannel('menu')}
                className="text-xs text-neutral-400 hover:text-white"
              >
                ← Back to Options
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-neutral-400 hover:text-white rounded hover:bg-neutral-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* VIEW 0: SELECTION MENU (3 DISTINCT CHOICES) */}
        {activeChannel === 'menu' && (
          <div className="p-6 sm:p-8 space-y-6 overflow-y-auto">
            <div className="text-center max-w-md mx-auto space-y-1">
              <h3 className="font-serif-brand text-lg font-semibold text-white">
                How would you prefer to connect with us?
              </h3>
              <p className="text-xs text-neutral-400">
                Choose your desired communication method below. Our architectural studio and automated systems are ready to assist.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              
              {/* Choice 1: Chat with Administration */}
              <button
                type="button"
                onClick={() => setActiveChannel('admin')}
                className="group p-5 bg-[#17181d] hover:bg-[#1d1f26] border border-neutral-800 hover:border-[#c5a880] rounded-xl text-left transition-all duration-200 flex items-start gap-4 shadow-lg"
              >
                <div className="w-12 h-12 rounded-lg bg-[#252830] group-hover:bg-[#c5a880] text-[#c5a880] group-hover:text-black flex items-center justify-center flex-shrink-0 transition-colors">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-serif-brand text-base font-semibold text-white group-hover:text-[#c5a880] transition-colors">
                      1. Chat with Administration
                    </h4>
                    <span className="text-[10px] font-mono-spec text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/40">
                      LIVE DISPATCH
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                    Direct two-way message terminal connecting you straight to the Admin Dashboard. Ideal for custom foundry quotes, delivery gate updates, and direct oversight from casting directors.
                  </p>
                </div>
              </button>

              {/* Choice 2: Chat with AI */}
              <button
                type="button"
                onClick={() => setActiveChannel('ai')}
                className="group p-5 bg-[#17181d] hover:bg-[#1d1f26] border border-neutral-800 hover:border-[#c5a880] rounded-xl text-left transition-all duration-200 flex items-start gap-4 shadow-lg"
              >
                <div className="w-12 h-12 rounded-lg bg-[#252830] group-hover:bg-[#c5a880] text-[#c5a880] group-hover:text-black flex items-center justify-center flex-shrink-0 transition-colors">
                  <Bot className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-serif-brand text-base font-semibold text-white group-hover:text-[#c5a880] transition-colors">
                      2. Chat with AI Assistant
                    </h4>
                    <span className="text-[10px] font-mono-spec text-[#c5a880] bg-[#c5a880]/15 px-2 py-0.5 rounded border border-[#c5a880]/30">
                      INSTANT 24/7
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                    Interactive built-in intelligent assistant trained on concrete mineral aggregates, hydration curing schedules, shipping weight calculations, crating dimensions, and Cash on Delivery terms.
                  </p>
                </div>
              </button>

              {/* Choice 3: Request a Call */}
              <button
                type="button"
                onClick={() => {
                  setCallSubmitted(false);
                  setActiveChannel('call');
                }}
                className="group p-5 bg-[#17181d] hover:bg-[#1d1f26] border border-neutral-800 hover:border-[#c5a880] rounded-xl text-left transition-all duration-200 flex items-start gap-4 shadow-lg"
              >
                <div className="w-12 h-12 rounded-lg bg-[#252830] group-hover:bg-[#c5a880] text-[#c5a880] group-hover:text-black flex items-center justify-center flex-shrink-0 transition-colors">
                  <PhoneCall className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-serif-brand text-base font-semibold text-white group-hover:text-[#c5a880] transition-colors">
                      3. Request a Call
                    </h4>
                    <span className="text-[10px] font-mono-spec text-neutral-400 bg-neutral-900 px-2 py-0.5 rounded border border-neutral-800">
                      SCHEDULED
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                    Provide your telephone number and preferred callback window. A master casting director or senior freight manager will contact you directly to discuss your space or resolve any consignment issue.
                  </p>
                </div>
              </button>

            </div>
          </div>
        )}

        {/* VIEW 1: CHAT WITH ADMINISTRATION */}
        {activeChannel === 'admin' && (
          <div className="flex-1 flex flex-col h-[520px] overflow-hidden">
            <div className="px-5 py-2.5 bg-[#18191e] border-b border-neutral-800 flex items-center justify-between text-xs">
              <span className="text-neutral-300 font-medium">Channel: Admin Dashboard Live Terminal</span>
              <span className="text-[10px] font-mono-spec text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Sync Connected
              </span>
            </div>

            <div className="flex-1 p-5 overflow-y-auto space-y-3 bg-[#0f1013]">
              {adminMessages.map((msg) => {
                const isMe = msg.sender === 'client';
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                  >
                    <div className="text-[10px] text-neutral-500 font-mono-spec mb-0.5 px-1">
                      {isMe ? 'You' : 'PRYZM Administration'} · {msg.timestamp}
                    </div>
                    <div
                      className={`max-w-[80%] rounded-lg p-3 text-xs leading-relaxed ${
                        isMe
                          ? 'bg-[#c5a880] text-black font-medium'
                          : 'bg-[#1e2026] text-neutral-200 border border-neutral-800'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                );
              })}
            </div>

            <form onSubmit={handleAdminSend} className="p-4 bg-[#17181c] border-t border-neutral-800 flex gap-2">
              <input
                type="text"
                value={adminInput}
                onChange={(e) => setAdminInput(e.target.value)}
                placeholder="Message the studio administration directly..."
                className="flex-1 bg-[#111215] border border-neutral-700 focus:border-[#c5a880] rounded px-3 py-2 text-xs text-white placeholder-neutral-500 outline-none"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-[#c5a880] hover:bg-[#b89a70] text-black font-semibold text-xs rounded transition-colors"
              >
                Send
              </button>
            </form>
          </div>
        )}

        {/* VIEW 2: CHAT WITH AI ASSISTANT */}
        {activeChannel === 'ai' && (
          <div className="flex-1 flex flex-col h-[520px] overflow-hidden">
            <div className="px-5 py-2.5 bg-[#18191e] border-b border-neutral-800 flex items-center justify-between text-xs">
              <span className="text-neutral-300 font-medium flex items-center gap-1.5">
                <Bot className="w-3.5 h-3.5 text-[#c5a880]" />
                PRYZM Architectural Intelligence (AI)
              </span>
              <span className="text-[10px] font-mono-spec text-[#c5a880] bg-[#c5a880]/10 px-2 py-0.5 rounded">
                Instant Product & Freight Q&A
              </span>
            </div>

            <div className="flex-1 p-5 overflow-y-auto space-y-3 bg-[#0f1013]">
              {aiChatHistory.map((item, idx) => {
                const isUser = item.sender === 'user';
                return (
                  <div
                    key={idx}
                    className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                  >
                    <div className="text-[10px] text-neutral-500 font-mono-spec mb-0.5 px-1">
                      {isUser ? 'You' : 'Architectural AI'} · {item.time}
                    </div>
                    <div
                      className={`max-w-[82%] rounded-lg p-3 text-xs leading-relaxed ${
                        isUser
                          ? 'bg-[#c5a880] text-black font-medium'
                          : 'bg-[#1b1c22] text-neutral-200 border border-neutral-800'
                      }`}
                    >
                      {item.text}
                    </div>
                  </div>
                );
              })}

              {isAiThinking && (
                <div className="flex items-center gap-1.5 text-xs text-neutral-400 bg-[#1b1c22] p-2.5 rounded-lg max-w-[140px] border border-neutral-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#c5a880] animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#c5a880] animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#c5a880] animate-bounce [animation-delay:0.4s]" />
                  <span className="text-[10px] ml-1">Analyzing...</span>
                </div>
              )}
            </div>

            {/* Quick AI Prompt Pills */}
            <div className="px-4 py-2 bg-[#141518] border-t border-neutral-800/80 flex gap-2 overflow-x-auto text-[11px]">
              {[
                'How does Cash on Delivery work?',
                'Are concrete vessels stain resistant?',
                'What is the weight of Kratos Pedestal?',
                'Can I request a refund if damaged?'
              ].map((p, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setAiInput(p)}
                  className="px-2.5 py-1 bg-[#1d1f26] hover:bg-[#252832] text-neutral-300 rounded border border-neutral-800 whitespace-nowrap transition-colors"
                >
                  {p}
                </button>
              ))}
            </div>

            <form onSubmit={handleAiSend} className="p-4 bg-[#17181c] border-t border-neutral-800 flex gap-2">
              <input
                type="text"
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                placeholder="Ask about products, dimensions, curing, shipping fees, or COD..."
                className="flex-1 bg-[#111215] border border-neutral-700 focus:border-[#c5a880] rounded px-3 py-2 text-xs text-white placeholder-neutral-500 outline-none"
              />
              <button
                type="submit"
                disabled={isAiThinking}
                className="px-4 py-2 bg-[#c5a880] hover:bg-[#b89a70] text-black font-semibold text-xs rounded transition-colors disabled:opacity-50"
              >
                Ask AI
              </button>
            </form>
          </div>
        )}

        {/* VIEW 3: REQUEST A CALL */}
        {activeChannel === 'call' && (
          <div className="p-6 sm:p-8 space-y-6 overflow-y-auto">
            {callSubmitted ? (
              <div className="py-10 text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-950 border border-emerald-500 flex items-center justify-center mx-auto text-emerald-400">
                  <CheckCircle className="w-7 h-7" />
                </div>
                <h3 className="font-serif-brand text-2xl font-bold text-white">
                  Callback Confirmed
                </h3>
                <p className="text-xs text-neutral-400 max-w-sm mx-auto leading-relaxed">
                  Thank you, <strong>{callFullName}</strong>. Your callback request has been dispatched to the foundry concierge. We will call you at <strong>{callPhone}</strong> during: <strong>{callPreferredTime}</strong>.
                </p>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveChannel('menu')}
                    className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded text-xs transition-colors"
                  >
                    Return to Support Options
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleCallbackSubmit} className="space-y-4 max-w-lg mx-auto">
                <div className="text-left space-y-1">
                  <h3 className="font-serif-brand text-lg font-semibold text-white">
                    Request an Architectural Concierge Callback
                  </h3>
                  <p className="text-xs text-neutral-400">
                    A senior member of our studio team will call you directly at your convenience.
                  </p>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={callFullName}
                    onChange={(e) => setCallFullName(e.target.value)}
                    placeholder="e.g. Sebastian Meyer"
                    className="w-full bg-[#111215] border border-neutral-700 focus:border-[#c5a880] rounded px-3 py-2 text-xs text-white placeholder-neutral-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1">
                    Contact Phone Number (with Country Code) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={callPhone}
                    onChange={(e) => setCallPhone(e.target.value)}
                    placeholder="+1 (555) 890-4421 / +971 50 123 4567"
                    className="w-full bg-[#111215] border border-neutral-700 focus:border-[#c5a880] rounded px-3 py-2 text-xs text-white placeholder-neutral-500 outline-none font-mono-spec"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1">
                    Preferred Callback Window *
                  </label>
                  <select
                    value={callPreferredTime}
                    onChange={(e) => setCallPreferredTime(e.target.value)}
                    className="w-full bg-[#111215] border border-neutral-700 focus:border-[#c5a880] rounded px-3 py-2 text-xs text-white outline-none"
                  >
                    <option value="Urgent · Within 30 Minutes">Urgent · Within 30 Minutes</option>
                    <option value="Morning (9:00 AM – 12:00 PM)">Morning (9:00 AM – 12:00 PM)</option>
                    <option value="Afternoon (12:00 PM – 4:00 PM)">Afternoon (12:00 PM – 4:00 PM)</option>
                    <option value="Evening (4:00 PM – 8:00 PM)">Evening (4:00 PM – 8:00 PM)</option>
                    <option value="Tomorrow Morning">Tomorrow Morning</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1">
                    Subject / Consignment Issue Details
                  </label>
                  <textarea
                    rows={3}
                    value={callTopic}
                    onChange={(e) => setCallTopic(e.target.value)}
                    placeholder="Briefly describe your question, bespoke size requirements, or delivery issue..."
                    className="w-full bg-[#111215] border border-neutral-700 focus:border-[#c5a880] rounded px-3 py-2 text-xs text-white placeholder-neutral-500 outline-none resize-none"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveChannel('menu')}
                    className="px-4 py-2 bg-neutral-800 text-xs text-neutral-300 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-[#c5a880] hover:bg-[#b89a70] text-black font-semibold text-xs uppercase tracking-wider rounded transition-colors"
                  >
                    Schedule Callback
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
