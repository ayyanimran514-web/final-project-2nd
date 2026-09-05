import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bot, 
  Sparkles, 
  X, 
  Send, 
  MessageSquare, 
  ChevronRight, 
  Shirt, 
  Palette, 
  HelpCircle,
  ExternalLink,
  RotateCcw
} from 'lucide-react';
import { Product } from '../types';
import { AnimatedButton } from './AnimatedButton';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  suggestedProductIds?: string[];
}

interface AiAssistantProps {
  products: Product[];
  onOpenProduct: (product: Product) => void;
  onOpenStudio: (baseType?: any) => void;
}

export const AiAssistant: React.FC<AiAssistantProps> = ({
  products,
  onOpenProduct,
  onOpenStudio
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Welcome to BUYLY! I'm your AI Stylist & Store Guide. 

I can help you with:
• Finding the right streetwear piece or fabric weight (up to 460 GSM!)
• Sizing advice and colorway pairings
• Navigating the interactive 3D Custom Studio
• Recommending gifts and outfit combinations

What can I help you find today?`,
      timestamp: 'Just now'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const quickPrompts = [
    'Which hoodie is the heaviest?',
    'How does the Custom Studio work?',
    'Recommend a boxy streetwear outfit',
    'Best gift picks under $50',
    'How does sizing run on your tees?'
  ];

  const handleSendMessage = async (userText: string) => {
    if (!userText.trim() || isLoading) return;

    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          history: messages.slice(-5).map(m => ({
            role: m.role === 'user' ? 'user' : 'model',
            content: m.content
          }))
        })
      });

      if (!response.ok) {
        throw new Error(`Server returned status: ${response.status}`);
      }

      const data = await response.json();
      const replyText = data.reply || 'I am ready to help you with your streetwear questions!';

      // Detect product mentions in reply or query to render quick-action cards
      const lower = (userText + ' ' + replyText).toLowerCase();
      const matchedProducts = products.filter(p => {
        const namePart = p.name.toLowerCase();
        const base = p.baseType.toLowerCase();
        return lower.includes(namePart) || (lower.includes(base) && (base === 'hoodie' || base === 'tshirt' || base === 'pants'));
      }).slice(0, 2);

      const aiMessage: Message = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedProductIds: matchedProducts.map(p => p.id)
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (err) {
      console.error('AI chat failed, falling back:', err);
      // Friendly local fallback
      const aiMessage: Message = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: `I'd love to help! For the heaviest cold-weather piece, check out the **Sub-Zero Thermal Zip Hoodie ($88)** with 460 GSM brushed French Terry cotton. For an oversized daily tee, our **Cyber Heavyweight Boxy Tee ($44)** is 280 GSM ring-spun cotton. Both are customizable with live color preview in our Studio!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedProductIds: ['prod-2', 'prod-1']
      };
      setMessages(prev => [...prev, aiMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Launcher Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 px-4 py-3 rounded-full bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 text-white shadow-[0_10px_30px_rgba(99,102,241,0.5)] border border-indigo-400/50 flex items-center gap-2.5 backdrop-blur-md cursor-pointer group"
      >
        <div className="relative">
          <Bot className="w-5 h-5 text-white" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400" />
        </div>
        <div className="flex flex-col text-left">
          <span className="text-xs font-bold font-display tracking-wide flex items-center gap-1">
            <span>BUYLY AI Stylist</span>
            <Sparkles className="w-3 h-3 text-amber-300 fill-amber-300" />
          </span>
          <span className="text-[10px] text-indigo-200 font-mono">Guide & Recommendations</span>
        </div>
      </motion.button>

      {/* AI Assistant Chat Drawer/Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-end sm:p-6 pointer-events-none">
            {/* Backdrop for mobile */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-neutral-950/60 backdrop-blur-sm sm:hidden pointer-events-auto"
            />

            {/* Chat Container */}
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.95 }}
              transition={{ type: 'spring', damping: 26, stiffness: 350 }}
              className="relative w-full sm:w-[420px] h-[92vh] sm:h-[620px] bg-neutral-900 border border-neutral-800 rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden pointer-events-auto z-10"
            >
              {/* Header */}
              <div className="px-5 py-4 bg-neutral-950/80 border-b border-neutral-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-2xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-white font-display">BUYLY Stylist AI</h3>
                      <span className="px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold">
                        ONLINE
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-400">Powered by Gemini AI • Real-time Guide</p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      setMessages([
                        {
                          id: 'welcome-reset',
                          role: 'assistant',
                          content: 'Conversation cleared! How can I assist you today with BUYLY streetwear or custom studio designs?',
                          timestamp: 'Just now'
                        }
                      ]);
                    }}
                    title="Reset conversation"
                    className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Quick Prompt Chips */}
              <div className="px-4 py-2.5 bg-neutral-950/40 border-b border-neutral-800/80 overflow-x-auto no-scrollbar flex items-center gap-2">
                <span className="text-[10px] font-mono text-neutral-400 whitespace-nowrap">QUICK ASKS:</span>
                {quickPrompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(prompt)}
                    className="px-2.5 py-1 rounded-full bg-neutral-800/90 hover:bg-indigo-600/30 hover:border-indigo-500/50 border border-neutral-700/80 text-[11px] text-neutral-300 hover:text-white whitespace-nowrap transition-colors cursor-pointer"
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              {/* Message Feed */}
              <div className="flex-1 p-4 overflow-y-auto space-y-4">
                {messages.map((msg) => {
                  const isUser = msg.role === 'user';
                  const suggestedProducts = msg.suggestedProductIds
                    ? products.filter(p => msg.suggestedProductIds?.includes(p.id))
                    : [];

                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`max-w-[88%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                          isUser
                            ? 'bg-indigo-600 text-white rounded-br-xs shadow-md'
                            : 'bg-neutral-950/90 text-neutral-200 border border-neutral-800 rounded-bl-xs shadow-sm'
                        }`}
                      >
                        <p className="whitespace-pre-line">{msg.content}</p>

                        {/* If AI recommended products, render actionable preview cards! */}
                        {suggestedProducts.length > 0 && (
                          <div className="mt-3 pt-2.5 border-t border-neutral-800/80 space-y-2">
                            <span className="text-[10px] font-mono text-indigo-400 uppercase font-semibold block">
                              RECOMMENDED ITEMS:
                            </span>
                            {suggestedProducts.map(sp => (
                              <div
                                key={sp.id}
                                className="flex items-center justify-between p-2 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 transition-colors"
                              >
                                <div className="flex items-center gap-2 min-w-0">
                                  <div
                                    className="w-3.5 h-3.5 rounded-full shrink-0 border border-white/20"
                                    style={{ backgroundColor: sp.colors[0]?.hex || '#fff' }}
                                  />
                                  <div className="truncate">
                                    <span className="font-bold text-white block truncate text-[11px]">{sp.name}</span>
                                    <span className="text-[10px] text-neutral-400">${sp.price}</span>
                                  </div>
                                </div>

                                <div className="flex items-center gap-1 shrink-0">
                                  <button
                                    onClick={() => {
                                      onOpenProduct(sp);
                                      setIsOpen(false);
                                    }}
                                    className="px-2 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-[10px] text-white font-semibold cursor-pointer"
                                  >
                                    View
                                  </button>
                                  {sp.isCustomizable && (
                                    <button
                                      onClick={() => {
                                        onOpenStudio(sp.baseType);
                                        setIsOpen(false);
                                      }}
                                      className="px-2 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-[10px] text-white font-semibold cursor-pointer"
                                    >
                                      Studio
                                    </button>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <span className="text-[10px] text-neutral-400 mt-1 px-1">
                        {msg.timestamp}
                      </span>
                    </div>
                  );
                })}

                {isLoading && (
                  <div className="flex items-center gap-2 p-3 rounded-2xl bg-neutral-950/80 border border-neutral-800 w-fit">
                    <Bot className="w-3.5 h-3.5 text-indigo-400 animate-spin" />
                    <span className="text-xs text-neutral-400">Stylist is thinking...</span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-3 bg-neutral-950 border-t border-neutral-800">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage(input);
                  }}
                  className="flex items-center gap-2"
                >
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about sizing, 460 GSM hoodies, studio..."
                    className="flex-1 px-4 py-2.5 rounded-2xl bg-neutral-900 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || isLoading}
                    className="p-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white transition-colors cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
