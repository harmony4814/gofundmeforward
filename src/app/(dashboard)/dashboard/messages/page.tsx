"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

interface Conversation {
  id: string;
  name: string;
  avatar: string | null;
  lastMessage: string;
  timestamp: string;
  unread: number;
}

interface ChatMessage {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
}

const CONVERSATIONS: Conversation[] = [
  { id: "1", name: "Sarah Wilson", avatar: "/avatars/sarah.jpg", lastMessage: "Thank you for your support!", timestamp: "2h ago", unread: 2 },
  { id: "2", name: "Mike Johnson", avatar: "/avatars/mike.jpg", lastMessage: "When is the next update?", timestamp: "5h ago", unread: 0 },
  { id: "3", name: "Emily Chen", avatar: "/avatars/emily.jpg", lastMessage: "I'd love to help with the project", timestamp: "1d ago", unread: 1 },
  { id: "4", name: "David Brown", avatar: "/avatars/david.jpg", lastMessage: "Great campaign!", timestamp: "3d ago", unread: 0 },
  { id: "5", name: "Lisa Anderson", avatar: "/avatars/lisa.jpg", lastMessage: "Can we schedule a call?", timestamp: "1w ago", unread: 0 },
];

const MESSAGES: Record<string, ChatMessage[]> = {
  "1": [
    { id: "m1", senderId: "user", content: "Hi Sarah! Thank you so much for your generous donation to the school project.", timestamp: "10:00 AM" },
    { id: "m2", senderId: "sarah", content: "Of course! I'm happy to help. How is the project going?", timestamp: "10:05 AM" },
    { id: "m3", senderId: "user", content: "We've raised 65% of our goal so far! Construction is set to begin next month.", timestamp: "10:10 AM" },
    { id: "m4", senderId: "sarah", content: "That's wonderful news! Keep up the great work.", timestamp: "10:15 AM" },
    { id: "m5", senderId: "sarah", content: "Thank you for your support!", timestamp: "10:16 AM" },
  ],
};

const CURRENT_USER = "user";

export default function MessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState<string | null>("1");
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>(MESSAGES);
  const [search, setSearch] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentMessages = selectedConversation ? messages[selectedConversation] || [] : [];

  const filteredConversations = CONVERSATIONS.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentMessages.length]);

  const handleSend = () => {
    if (!newMessage.trim() || !selectedConversation) return;
    const msg: ChatMessage = {
      id: `m${Date.now()}`,
      senderId: CURRENT_USER,
      content: newMessage.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages((prev) => ({
      ...prev,
      [selectedConversation]: [...(prev[selectedConversation] || []), msg],
    }));
    setNewMessage("");
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] overflow-hidden rounded-xl border border-border bg-card">
      <div className={cn("flex flex-col border-r border-border", selectedConversation ? "hidden md:flex" : "flex", "w-full md:w-80 lg:w-96")}>
        <div className="p-3">
          <h3 className="mb-2 text-sm font-semibold text-foreground">Messages</h3>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search conversations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-8 pl-8"
            />
          </div>
        </div>
        <Separator />
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => setSelectedConversation(conv.id)}
              className={cn(
                "flex w-full items-center gap-3 p-3 text-left transition-colors hover:bg-muted/50",
                selectedConversation === conv.id && "bg-muted"
              )}
            >
              <Avatar size="default">
                <AvatarImage src={conv.avatar || undefined} alt={conv.name} />
                <AvatarFallback>{conv.name[0]}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">{conv.name}</span>
                  <span className="text-[11px] text-muted-foreground">{conv.timestamp}</span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground truncate">{conv.lastMessage}</p>
                  {conv.unread > 0 && (
                    <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                      {conv.unread}
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {selectedConversation ? (
        <div className="hidden md:flex flex-1 flex-col">
          <div className="flex items-center gap-3 border-b border-border p-3">
            <Avatar size="sm">
              <AvatarImage
                src={CONVERSATIONS.find((c) => c.id === selectedConversation)?.avatar || undefined}
                alt={CONVERSATIONS.find((c) => c.id === selectedConversation)?.name}
              />
              <AvatarFallback>
                {CONVERSATIONS.find((c) => c.id === selectedConversation)?.name[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium text-foreground">
                {CONVERSATIONS.find((c) => c.id === selectedConversation)?.name}
              </p>
              <p className="text-[11px] text-green-500">Online</p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {currentMessages.map((msg) => (
              <div
                key={msg.id}
                className={cn("flex", msg.senderId === CURRENT_USER ? "justify-end" : "justify-start")}
              >
                <div
                  className={cn(
                    "max-w-[70%] rounded-xl px-3.5 py-2 text-sm",
                    msg.senderId === CURRENT_USER
                      ? "bg-primary text-primary-foreground rounded-br-sm"
                      : "bg-muted text-foreground rounded-bl-sm"
                  )}
                >
                  <p>{msg.content}</p>
                  <p className={cn("text-[10px] mt-1", msg.senderId === CURRENT_USER ? "text-primary-foreground/70" : "text-muted-foreground")}>
                    {msg.timestamp}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t border-border p-3">
            <div className="flex items-center gap-2">
              <Input
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                className="flex-1"
              />
              <Button
                onClick={handleSend}
                size="icon"
                className="bg-primary text-primary-foreground hover:bg-primary/90 shrink-0"
                disabled={!newMessage.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="hidden md:flex flex-1 items-center justify-center text-muted-foreground text-sm">
          Select a conversation to start messaging
        </div>
      )}
    </div>
  );
}
