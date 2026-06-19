import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Sparkles, AlertCircle } from 'lucide-react';

interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'model',
      text: "Bonjour! I am Gâteau, your luxury Sweet Delights pastry assistant. I can recommend our award-winning Rose Rasmalai Fusion Cake, golden ghee-sweetness boxes, or design custom event portions. How can I sweeten your day?",
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = { role: 'user', text: textToSend };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          chatHistory: messages,
        }),
      });
      const data = await response.json();
      if (data.reply) {
        setMessages((prev) => [...prev, { role: 'model', text: data.reply }]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: 'model', text: "Forgive me, my baking glaze has smudged. Let me recommend our delicious Ferrero Rocher cake in the meantime!" },
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: 'model', text: "Forgive me, my kitchen lines are down. Our cakes remain perfect though! Try calling us!" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const starterPrompts = [
    "What is the signature Rasmalai Cake?",
    "How many sweets do I need for 40 guests?",
    "Do you deliver? What is the shelf life?",
    "Recommend a delicious dark chocolate options",
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans" id="sweet-delights-ai-assistant">
      {/* Floating Toggle Icon */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 rounded-full bg-gradient-to-tr from-stone-900 to-amber-800 text-amber-400 flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all cursor-pointer border border-amber-500/20 group relative"
        >
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
          </span>
          <MessageCircle className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
          <div className="absolute right-16 bg-stone-900/90 text-amber-300 text-[10px] uppercase tracking-wider py-1.5 px-3 rounded-md font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity border border-amber-400/10 pointer-events-none">
            Chat with Gâteau-AI
          </div>
        </button>
      )}

      {/* Main Panel */}
      {isOpen && (
        <div className="w-[340px] sm:w-[380px] h-[520px] rounded-2xl bg-white dark:bg-stone-900 border border-amber-500/20 shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="bg-gradient-to-r from-stone-950 to-stone-900 text-stone-100 p-4 flex items-center justify-between border-b border-amber-500/20">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-stone-950 animate-pulse" />
              </div>
              <div>
                <h4 className="text-sm font-serif font-black tracking-wide text-amber-400">Gâteau Assistant</h4>
                <div className="flex items-center gap-1">
                  <span className="block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                  <span className="text-[10px] text-stone-400 font-mono">Chef Assistant Live</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-full text-stone-400 hover:text-stone-100 hover:bg-stone-800 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Chat message space */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-amber-50/10 dark:bg-stone-950/40">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm line-height-relaxed ${
                    msg.role === 'user'
                      ? 'bg-amber-600 text-white rounded-br-none'
                      : 'bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-100 rounded-bl-none border border-amber-500/5 shadow-sm'
                  }`}
                >
                  <p className="whitespace-pre-line leading-relaxed">{msg.text}</p>
                </div>
                <span className="text-[9px] text-stone-400 dark:text-stone-500 mt-1 font-mono uppercase">
                  {msg.role === 'user' ? 'Client' : 'Gâteau'}
                </span>
              </div>
            ))}

            {/* Thinking / Loading Bubble */}
            {loading && (
              <div className="flex flex-col items-start">
                <div className="bg-stone-100 dark:bg-stone-800 text-stone-500 rounded-2xl rounded-bl-none px-4 py-2 flex items-center gap-1.5 border border-amber-500/5">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-bounce delay-75" />
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-bounce delay-150" />
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-bounce delay-300" />
                  <span className="text-[11px] text-stone-400 italic">Chef Gâteau planning...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick FAQ Starters */}
          {messages.length === 1 && !loading && (
            <div className="p-3 border-t border-amber-500/10 bg-amber-50/5 flex flex-col gap-1">
              <span className="text-[10px] text-amber-700 dark:text-amber-400 font-mono uppercase font-bold mb-1">
                Frequently Asked Culinary Prompts:
              </span>
              <div className="flex flex-col gap-1.5">
                {starterPrompts.map((prompt, pIdx) => (
                  <button
                    key={pIdx}
                    onClick={() => handleSend(prompt)}
                    className="text-left w-full px-3 py-1.5 bg-stone-100 dark:bg-stone-850 hover:bg-amber-500/10 hover:text-amber-800 dark:hover:text-amber-300 rounded-lg text-[11px] text-stone-600 dark:text-stone-300 border border-stone-200/40 dark:border-stone-800 transition-all font-sans cursor-pointer text-ellipsis overflow-hidden whitespace-nowrap"
                  >
                    ✨ {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Bottom input area */}
          <div className="p-3 border-t border-amber-500/10 bg-white dark:bg-stone-900 flex gap-2">
            <input
              type="text"
              placeholder="Ask Gâteau or plan quantities..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend(inputValue)}
              className="flex-1 border border-stone-200 dark:border-stone-800 rounded-full px-4 py-2 text-xs sm:text-sm bg-stone-50 dark:bg-stone-950 focus:outline-none focus:border-amber-500/80 dark:text-stone-100"
            />
            <button
              onClick={() => handleSend(inputValue)}
              className="p-2 bg-gradient-to-tr from-stone-950 to-stone-800 hover:from-amber-600 hover:to-amber-500 text-amber-400 hover:text-stone-950 rounded-full transition-all flex items-center justify-center cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
