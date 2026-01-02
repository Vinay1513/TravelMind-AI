import { useState, useEffect, useRef } from "react";
import { MessageSquare, X, Send, Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useChatHistory, useSendMessage } from "@/hooks/use-chat";
import { motion, AnimatePresence } from "framer-motion";

export function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { data: history = [] } = useChatHistory();
  const { mutate: sendMessage, isPending } = useSendMessage();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [history, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isPending) return;

    sendMessage(
      { message: input },
      {
        onSuccess: () => setInput(""),
      }
    );
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-4 md:right-8 w-[90vw] md:w-96 h-[500px] glass-panel rounded-2xl flex flex-col shadow-2xl z-50 overflow-hidden border border-white/40"
          >
            {/* Header */}
            <div className="bg-primary/10 p-4 border-b border-white/20 flex justify-between items-center backdrop-blur-md">
              <div className="flex items-center space-x-2">
                <div className="bg-primary p-1.5 rounded-lg">
                  <Bot className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground">Travel AI</h3>
                  <p className="text-xs text-muted-foreground">Ask me anything about your trip</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-black/5 rounded-full transition-colors"
              >
                <X className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white/50">
              {history.length === 0 ? (
                <div className="text-center text-muted-foreground mt-8 p-4">
                  <Bot className="h-12 w-12 mx-auto mb-3 opacity-20" />
                  <p>Hello! I'm your personal travel assistant.</p>
                  <p className="text-sm mt-2">Ask me about weather, food, or hidden gems!</p>
                </div>
              ) : (
                history.map((msg, i) => (
                  <div
                    key={i}
                    className={cn(
                      "flex w-full",
                      msg.role === "user" ? "justify-end" : "justify-start"
                    )}
                  >
                    <div
                      className={cn(
                        "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm shadow-sm",
                        msg.role === "user"
                          ? "bg-primary text-white rounded-br-none"
                          : "bg-white text-foreground rounded-bl-none border border-border"
                      )}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))
              )}
              {isPending && (
                <div className="flex justify-start">
                  <div className="bg-white rounded-2xl rounded-bl-none px-4 py-3 border border-border shadow-sm">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-primary/40 rounded-full animate-bounce delay-75" />
                      <div className="w-2 h-2 bg-primary/40 rounded-full animate-bounce delay-150" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="p-4 bg-white border-t border-border">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type a message..."
                  className="w-full pl-4 pr-12 py-3 rounded-xl border border-input focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-muted/30"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isPending}
                  className="absolute right-2 p-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-24 right-4 md:bottom-8 md:right-8 h-14 w-14 rounded-full bg-primary text-white shadow-xl hover:shadow-2xl flex items-center justify-center z-40 hover:bg-primary/90 transition-all border-4 border-white/20 backdrop-blur-sm"
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}
      </motion.button>
    </>
  );
}
