import React, { useEffect, useMemo, useRef, useState } from 'react';
import { MessageSquare, X, Send, Sparkles, User, Bot } from 'lucide-react'; // Make sure to install lucide-react if not present
import apiClient from '../services/apiClient.js';
import { motion, AnimatePresence } from 'framer-motion';

function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello! 👋 I’m the IAAC assistant. I can help you with course details, admissions, and campus info. How can I assist you today?',
    },
  ]);

  const listRef = useRef(null);

  // Suggested prompts for new users
  const suggestions = [
    "What courses do you offer?",
    "How do I apply?",
    "Contact information",
    "Campus location"
  ];

  const apiMessages = useMemo(
    () => messages.filter((m) => m.role === 'user' || m.role === 'assistant'),
    [messages]
  );

  // Auto-scroll to bottom
  useEffect(() => {
    if (!open) return;
    const el = listRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [open, messages.length, sending]);

  const handleSend = async (textOverride) => {
    const text = textOverride || input.trim();
    if (!text || sending) return;

    setError('');
    setSending(true);

    const nextMessages = [...messages, { role: 'user', content: text }];
    setMessages(nextMessages);
    setInput('');

    try {
      const res = await apiClient.post(
        '/api/chat',
        { messages: nextMessages },
        // OpenAI calls can sometimes take >10s
        { timeout: 30000 }
      );
      const reply = res?.data?.reply;
      
      // Simulate a small natural delay for reading time if response is too fast
      // (Optional: remove setTimeout if you prefer instant)
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: typeof reply === 'string' ? reply : 'Sorry, I am having trouble connecting right now.' },
        ]);
        setSending(false);
      }, 600);

    } catch (e) {
      setSending(false);
      const serverMsg = e?.response?.data?.message;
      const msg =
        (typeof serverMsg === 'string' && serverMsg.trim()) ||
        (typeof e?.message === 'string' && e.message.trim()) ||
        'Connection failed. Please try again later.';
      setError(msg);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end gap-4">
      
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="w-[360px] max-w-[calc(100vw-2rem)] h-[500px] max-h-[80vh] bg-white border border-slate-200 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-4 flex items-center justify-between shadow-sm shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white backdrop-blur-sm">
                  <Bot size={20} />
                </div>
                <div>
                  <div className="text-white font-bold text-sm leading-tight">IAAC Assistant</div>
                  <div className="text-blue-100 text-[11px] flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span> Online
                  </div>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-white/80 hover:text-white hover:bg-white/10 p-1.5 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages Area */}
            <div ref={listRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
              {apiMessages.map((m, idx) => (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={idx}
                  className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {m.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0 mt-1 border border-blue-200">
                      <Sparkles size={14} />
                    </div>
                  )}
                  
                  <div
                    className={`text-sm px-4 py-3 rounded-2xl max-w-[85%] whitespace-pre-wrap shadow-sm ${
                      m.role === 'user'
                        ? 'bg-blue-600 text-white rounded-br-none'
                        : 'bg-white text-slate-800 border border-slate-100 rounded-bl-none'
                    }`}
                  >
                    {m.content}
                  </div>

                  {m.role === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 shrink-0 mt-1">
                      <User size={14} />
                    </div>
                  )}
                </motion.div>
              ))}

              {/* Typing Indicator */}
              {sending && (
                <div className="flex gap-3 justify-start">
                   <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0 mt-1 border border-blue-200">
                      <Sparkles size={14} />
                   </div>
                   <div className="bg-white border border-slate-100 px-4 py-3 rounded-2xl rounded-bl-none shadow-sm flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                      <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                      <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                   </div>
                </div>
              )}

              {error && (
                <div className="text-center">
                  <span className="text-xs text-red-500 bg-red-50 px-3 py-1 rounded-full border border-red-100">
                    {error}
                  </span>
                </div>
              )}

              {/* Quick Suggestions (Only show if history is short) */}
              {!sending && messages.length < 3 && (
                <div className="grid grid-cols-2 gap-2 mt-4 pt-2">
                  {suggestions.map((s) => (
                    <button
                      key={s}
                      onClick={() => handleSend(s)}
                      className="text-xs text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-100 px-3 py-2 rounded-xl transition-colors text-left truncate"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-3 bg-white border-t border-slate-100 shrink-0">
              <form 
                className="flex gap-2 items-end"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
              >
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="Type a message..."
                  className="flex-1 max-h-24 min-h-[44px] text-sm px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none text-slate-700 placeholder:text-slate-400 scrollbar-hide"
                  rows={1}
                />
                <button
                  type="submit"
                  disabled={sending || !input.trim()}
                  className="h-[44px] w-[44px] rounded-xl bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md shadow-blue-600/20 shrink-0"
                >
                  <Send size={18} className={sending ? 'opacity-0' : 'opacity-100'} />
                  {sending && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    </div>
                  )}
                </button>
              </form>
              <div className="text-center mt-2">
                <p className="text-[10px] text-slate-400">
                  AI responses may vary. For official info, contact IAAC directly.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(!open)}
        className={`w-14 h-14 rounded-full shadow-xl flex items-center justify-center transition-colors relative z-[100] ${
          open ? 'bg-slate-800 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'
        }`}
      >
        <AnimatePresence mode='wait'>
          {open ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <X size={24} />
            </motion.div>
          ) : (
            <motion.div key="chat" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }}>
              <MessageSquare size={24} />
              {/* Notification Dot */}
              <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 border-2 border-white rounded-full"></span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

    </div>
  );
}

export default ChatbotWidget;