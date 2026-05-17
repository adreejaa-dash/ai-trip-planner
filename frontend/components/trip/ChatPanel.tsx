"use client";

import { ChatMessage, ChatSuggestion } from "@/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles, Send, User, Bot, X } from "lucide-react";
import { useRef, useEffect } from "react";

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";
  return (
    <div className={cn("flex gap-2.5", isUser && "flex-row-reverse")}>
      <div className={cn("flex h-7 w-7 shrink-0 items-center justify-center rounded-full border mt-0.5", isUser ? "border-brand-500/40 bg-brand-500/20" : "border-emerald-500/40 bg-emerald-500/10")}>
        {isUser ? <User className="h-3.5 w-3.5 text-brand-400" /> : <Bot className="h-3.5 w-3.5 text-emerald-400" />}
      </div>
      <div className={cn("max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed", isUser ? "bg-brand-500/20 border border-brand-500/20 rounded-tr-sm" : "bg-secondary/60 border border-border/60 rounded-tl-sm")}>
        {message.isTyping ? (
          <div className="flex items-center gap-1 py-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-bounce" />
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-bounce [animation-delay:150ms]" />
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-bounce [animation-delay:300ms]" />
          </div>
        ) : message.content}
      </div>
    </div>
  );
}

interface ChatPanelProps {
  messages: ChatMessage[];
  suggestions?: ChatSuggestion[];
  inputValue: string;
  isTyping?: boolean;
  onSend: (message: string) => void;
  onInputChange: (value: string) => void;
  onClose?: () => void;
  className?: string;
}

export function ChatPanel({ messages, suggestions = [], inputValue, isTyping = false, onSend, onInputChange, onClose, className }: ChatPanelProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSubmit = () => { if (inputValue.trim()) onSend(inputValue.trim()); };

  return (
    <div className={cn("flex flex-col h-full bg-card/50 border border-border/60 rounded-2xl overflow-hidden", className)}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/50 bg-secondary/30">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-gradient shadow-sm">
            <Sparkles className="h-3.5 w-3.5 text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold">Refine with AI</p>
            <p className="text-[10px] text-muted-foreground">Ask to adjust your itinerary</p>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="rounded-lg p-1.5 text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors" aria-label="Close chat">
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar min-h-0">
        {messages.map((msg) => <MessageBubble key={msg.id} message={msg} />)}
        {isTyping && <MessageBubble message={{ id: "typing", role: "assistant", content: "", timestamp: new Date().toISOString(), isTyping: true }} />}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggestions */}
      {suggestions.length > 0 && messages.length <= 4 && (
        <div className="px-4 py-2 border-t border-border/40">
          <p className="text-[10px] text-muted-foreground mb-2 uppercase tracking-wide font-medium">Quick prompts</p>
          <div className="flex flex-wrap gap-1.5">
            {suggestions.map((s) => (
              <button key={s.id} onClick={() => onSend(s.prompt)} className="inline-flex items-center rounded-full border border-border/60 bg-secondary/40 px-3 py-1.5 text-xs text-muted-foreground hover:border-white/20 hover:bg-secondary/80 hover:text-foreground transition-all duration-200 whitespace-nowrap">
                {s.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-3 border-t border-border/50 bg-secondary/20">
        <div className="flex items-center gap-2">
          <Input
            ref={inputRef}
            id="chat-input"
            placeholder="Ask me to change anything…"
            value={inputValue}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey && inputValue.trim()) { e.preventDefault(); handleSubmit(); } }}
            disabled={isTyping}
            className="flex-1 h-9 text-xs bg-secondary/50 border-border/60"
          />
          <Button variant="gradient" size="icon-sm" onClick={handleSubmit} disabled={!inputValue.trim() || isTyping} aria-label="Send message">
            <Send className="h-3.5 w-3.5" />
          </Button>
        </div>
        <p className="text-[10px] text-muted-foreground mt-1.5 text-center">Press Enter to send · AI responses are simulated</p>
      </div>
    </div>
  );
}
