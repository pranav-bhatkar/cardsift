"use client";

import { useState } from "react";
import { X, Send, Bot, User, MessageCircle } from "lucide-react";
import { Button } from "@cc/components/ui/button";
import { Input } from "@cc/components/ui/input";
import { Badge } from "@cc/components/ui/badge";
import { CreditCardWithAllRelations } from "@cc/lib/prisma";
import { useChat } from "@ai-sdk/react";
import { UIMessage } from "ai";
import { generateUUID } from "@cc/lib/utils";
import { toast } from "sonner";

interface ChatModalProps {
  cards: CreditCardWithAllRelations[];
  onClose: () => void;
}

interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
}

const suggestions = [
  "Which card suits my profile?",
  "Compare rewards programs",
  "Explain eligibility differences",
  "What are the hidden fees?",
];

export function ChatModal({ cards, onClose }: ChatModalProps) {
  const {
    messages,
    setMessages,
    handleSubmit,
    input,
    setInput,
    append,
    status,
    stop,
    reload,
    experimental_resume,
    data,
  } = useChat({
    id: "chat-modal",
    initialMessages: [],
    experimental_throttle: 100,
    sendExtraMessageFields: true,
    generateId: generateUUID,
    experimental_prepareRequestBody: (body) => ({
      id: "chat-modal",
      message: body.messages.at(-1),
      cardIds: cards.map((card) => card.id),
    }),
    onFinish: (m) => {
      console.log("Message finished:", m);
    },
    onError: (error) => {
      toast.error("Error", {
        description: error.message || "An unexpected error occurred.",
      });
    },
  });
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMessage: UIMessage = {
      id: Date.now().toString(),
      content: "",
      parts: [
        {
          text: content,
          type: "text",
        },
      ],
      role: "user",
      createdAt: new Date(),
    };
    append(userMessage);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-end bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-card animate-in slide-in-from-right flex h-full w-full max-w-md flex-col border-l shadow-2xl duration-300"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b p-4">
          <div className="flex items-center space-x-2">
            <MessageCircle className="text-primary h-5 w-5" />
            <h3 className="font-semibold">AI Assistant</h3>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Suggestions */}
        <div className="border-b p-4">
          <p className="text-muted-foreground mb-3 text-sm">Quick questions:</p>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion, index) => (
              <Badge
                key={suggestion}
                variant="secondary"
                className="hover:bg-primary hover:text-primary-foreground cursor-pointer transition-colors"
                onClick={() => handleSendMessage(suggestion)}
              >
                {suggestion}
              </Badge>
            ))}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 space-y-4 overflow-y-auto p-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start space-x-3 ${
                message.role === "user"
                  ? "flex-row-reverse space-x-reverse"
                  : ""
              }`}
            >
              <div
                className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                {message.role === "user" ? (
                  <User className="h-4 w-4" />
                ) : (
                  <Bot className="h-4 w-4" />
                )}
              </div>

              <div
                className={`max-w-[80%] ${message.role === "user" ? "text-right" : ""}`}
              >
                <div
                  className={`rounded-lg px-4 py-3 ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground ml-auto"
                      : "bg-muted"
                  }`}
                >
                  <p className="text-sm whitespace-pre-line">
                    {message.content}
                  </p>
                </div>
                <p className="text-muted-foreground mt-1 text-xs">
                  {message.createdAt?.toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-start space-x-3">
              <div className="bg-muted flex h-8 w-8 items-center justify-center rounded-full">
                <Bot className="h-4 w-4" />
              </div>
              <div className="bg-muted rounded-lg px-4 py-3">
                <div className="flex space-x-1">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="bg-muted-foreground h-2 w-2 animate-bounce rounded-full"
                      style={{ animationDelay: `${i * 0.2}s` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="border-t p-4">
          <div className="flex space-x-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask about these cards..."
              onKeyPress={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(inputValue);
                }
              }}
              disabled={isLoading}
            />
            <Button
              onClick={() => handleSendMessage(inputValue)}
              disabled={isLoading || !inputValue.trim()}
              size="icon"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
