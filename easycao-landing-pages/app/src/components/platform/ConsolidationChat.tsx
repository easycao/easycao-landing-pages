"use client";

import { useState, useRef, useEffect } from "react";
import { useTheme } from "@/contexts/ThemeContext";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface ConsolidationChatProps {
  concepts: string[];
  language: "pt" | "en";
  onComplete: () => void;
  disabled?: boolean;
}

export default function ConsolidationChat({
  concepts,
  language,
  onComplete,
  disabled,
}: ConsolidationChatProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [started, setStarted] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const textPrimary = isDark ? "text-[#F0F0F5]" : "text-black";
  const textSecondary = isDark ? "text-[#9090A0]" : "text-black/50";

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function startChat() {
    setStarted(true);
    setLoading(true);

    try {
      const res = await fetch("/api/consolidation/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          concepts,
          language,
          message: language === "en" ? "Hello, I'm ready to review." : "Olá, estou pronto para revisar.",
          history: [],
        }),
      });
      const data = await res.json();
      setMessages([
        { role: "user", content: language === "en" ? "Hello, I'm ready to review." : "Olá, estou pronto para revisar." },
        { role: "assistant", content: data.reply },
      ]);
    } catch {
      setMessages([
        { role: "assistant", content: language === "en" ? "Something went wrong. Please try again." : "Algo deu errado. Tente novamente." },
      ]);
    }
    setLoading(false);
  }

  async function sendMessage() {
    if (!input.trim() || loading || isComplete) return;

    const userMsg: ChatMessage = { role: "user", content: input.trim() };
    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/consolidation/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          concepts,
          language,
          message: userMsg.content,
          history: messages,
        }),
      });
      const data = await res.json();
      setMessages([...newHistory, { role: "assistant", content: data.reply }]);

      if (data.isComplete) {
        setIsComplete(true);
        onComplete();
      }
    } catch {
      setMessages([
        ...newHistory,
        { role: "assistant", content: language === "en" ? "Error. Please try again." : "Erro. Tente novamente." },
      ]);
    }
    setLoading(false);
  }

  if (disabled) {
    return (
      <div className={`p-4 rounded-xl ${isDark ? "bg-white/5" : "bg-gray-50"}`}>
        <p className={`text-sm ${textSecondary}`}>
          {language === "en"
            ? "Complete the video lesson first to unlock consolidation."
            : "Conclua a videoaula primeiro para desbloquear a consolidação."}
        </p>
      </div>
    );
  }

  if (!started) {
    return (
      <div className="text-center py-6">
        <p className={`text-sm ${textSecondary} mb-4`}>
          {language === "en"
            ? "Ready to consolidate what you learned?"
            : "Pronto para consolidar o que aprendeu?"}
        </p>
        <button
          onClick={startChat}
          className="px-6 py-2.5 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          {language === "en" ? "Start Review" : "Iniciar Revisão"}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Messages */}
      <div className={`space-y-3 max-h-[400px] overflow-y-auto p-1`}>
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-primary text-white rounded-br-md"
                  : isDark
                    ? "bg-white/10 text-white/90 rounded-bl-md"
                    : "bg-gray-100 text-black/80 rounded-bl-md"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className={`px-4 py-2.5 rounded-2xl rounded-bl-md ${isDark ? "bg-white/10" : "bg-gray-100"}`}>
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Completion badge */}
      {isComplete && (
        <div className={`flex items-center gap-2 p-3 rounded-xl ${isDark ? "bg-emerald-500/15" : "bg-emerald-50"}`}>
          <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
          <p className={`text-sm font-medium text-emerald-500`}>
            {language === "en" ? "Consolidation complete!" : "Consolidação concluída!"}
          </p>
        </div>
      )}

      {/* Input */}
      {!isComplete && (
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder={language === "en" ? "Type your answer..." : "Digite sua resposta..."}
            disabled={loading}
            className={`flex-1 px-4 py-2.5 rounded-xl text-sm border outline-none transition-colors ${
              isDark
                ? "bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-primary/40"
                : "bg-white border-gray-200 text-black placeholder:text-black/30 focus:border-primary/40"
            }`}
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className="px-4 py-2.5 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
