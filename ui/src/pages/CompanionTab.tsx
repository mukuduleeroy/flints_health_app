import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Send, Mic, Sparkles, Shield, Ear, Brain, Heart } from "lucide-react";
import { MarkdownText } from "../components/MarkdownText";

type Message = {
  id: string;
  role: "user" | "assistant";
  text: string;
  timestamp: Date;
};

export function CompanionTab() {
  const [mode, setMode] = useState<"listen" | "reflect" | "ground">("listen");
  const messages: Message[] = [];
  const inputValue = "";
  const isTyping = false;
  const isLoadingHistory = false;
  const messagesEndRef = useRef<HTMLDivElement>(null);
  return (
    <div className="companion-screen flex flex-col h-[calc(100vh-4rem)] bg-background relative pb-20">
      <div className="max-w-2xl mx-auto w-full flex flex-col h-full">
        {/* Header */}
        <div className="companion-header px-6 py-4 border-b border-divider/50 flex items-center justify-between bg-background/80 backdrop-blur-sm z-10">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-sage/20 flex items-center justify-center text-sage">
              <Sparkles size={16} />
            </div>
            <div>
              <h2 className="text-sm font-medium text-primary">
                Flints Companion
              </h2>
              <p className="text-[10px] text-sage font-medium">Not connected</p>
            </div>
          </div>

          <div className="companion-modes flex items-center space-x-2">
            {/* Mode Selector - Pill Buttons */}
            <div className="flex items-center bg-white rounded-full p-1 shadow-sm border border-divider/50">
              <button
                onClick={() => setMode("listen")}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  mode === "listen"
                    ? "bg-sage text-white shadow-sm"
                    : "text-secondary hover:text-primary"
                }`}
              >
                <Ear size={12} />
                <span>Listen</span>
              </button>
              <button
                onClick={() => setMode("reflect")}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  mode === "reflect"
                    ? "bg-sage text-white shadow-sm"
                    : "text-secondary hover:text-primary"
                }`}
              >
                <Brain size={12} />
                <span>Reflect</span>
              </button>
              <button
                onClick={() => setMode("ground")}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  mode === "ground"
                    ? "bg-sage text-white shadow-sm"
                    : "text-secondary hover:text-primary"
                }`}
              >
                <Heart size={12} />
                <span>Ground</span>
              </button>
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="companion-thread flex-1 overflow-y-auto p-6 space-y-3 pb-24">
          <div className="flex justify-center mb-8">
            <div className="bg-sage/10 text-sage text-xs px-4 py-2 rounded-full flex items-center space-x-2">
              <Shield size={12} />
              <span>Private space · AI disconnected</span>
            </div>
          </div>

          <div
            role="status"
            className="bg-white border border-divider/50 rounded-2xl p-6 text-sm text-primary leading-relaxed"
          >
            <h3 className="font-medium mb-2">Your companion space</h3>
            <p>
              AI chat is disconnected for now. Listen, Reflect and Ground will
              be available when an AI connection is added.
            </p>
            <p className="mt-3 text-secondary">
              You can still record your thoughts in your journal on the Home
              tab. Nothing is sent to an AI service.
            </p>
          </div>
          {isLoadingHistory && (
            <div className="flex justify-center items-center py-8">
              <div className="text-sm text-secondary">
                Loading conversation history...
              </div>
            </div>
          )}

          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{
                opacity: 0,
                y: 10,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed ${msg.role === "user" ? "bg-primary text-white rounded-tr-sm" : "bg-white border border-divider/50 text-primary rounded-tl-sm shadow-sm"}`}
              >
                {msg.role === "assistant" ? (
                  <MarkdownText text={msg.text} />
                ) : (
                  msg.text
                )}
              </div>
            </motion.div>
          ))}

          {isTyping && (
            <motion.div
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              className="flex justify-start"
            >
              <div className="bg-white border border-divider/50 px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm flex space-x-1">
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 1.5,
                    delay: 0,
                  }}
                  className="w-1.5 h-1.5 bg-sage/40 rounded-full"
                />
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 1.5,
                    delay: 0.2,
                  }}
                  className="w-1.5 h-1.5 bg-sage/60 rounded-full"
                />
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 1.5,
                    delay: 0.4,
                  }}
                  className="w-1.5 h-1.5 bg-sage rounded-full"
                />
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="companion-composer absolute bottom-0 left-0 right-0 p-4 bg-background border-t border-divider/50">
          <div className="relative flex items-center max-w-2xl mx-auto">
            <input
              type="text"
              value={inputValue}
              disabled
              aria-label="AI chat is disconnected"
              placeholder="AI chat is disconnected"
              className="w-full bg-white border border-divider rounded-full pl-6 pr-24 py-4 text-sm focus:outline-none focus:border-sage focus:ring-1 focus:ring-sage transition-all shadow-sm"
            />
            <div className="absolute right-2 flex items-center space-x-1">
              <button
                aria-label="Microphone unavailable while AI is disconnected"
                disabled
                className="p-2 text-secondary hover:text-primary transition-colors"
              >
                <Mic size={20} />
              </button>
              <button
                aria-label="Send message"
                disabled
                className="p-2 bg-sage text-white rounded-full hover:bg-sage-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
