'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Send, ArrowLeft, MessageSquare, User as UserIcon } from 'lucide-react';

interface MessageUser {
  id: string;
  name: string | null;
  username: string | null;
  image: string | null;
  isPro?: boolean;
}

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: string;
  readAt: string | null;
  sender: MessageUser;
  receiver: MessageUser;
}

interface Conversation {
  partner: MessageUser;
  lastMessage: Message;
  unreadCount: number;
}

export default function MessagesPage() {
  const { data: session, status } = useSession();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedPartner, setSelectedPartner] = useState<MessageUser | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState('');

  const fetchConversations = useCallback(async () => {
    try {
      const res = await fetch('/api/messages');
      const data = await res.json();
      if (data.success) {
        setConversations(data.data);
      }
    } catch (_err) {
      console.error('Failed to fetch conversations', _err);
    }
  }, []);

  const fetchMessages = useCallback(async (partnerId: string) => {
    try {
      const res = await fetch(`/api/messages?withUserId=${encodeURIComponent(partnerId)}`);
      const data = await res.json();
      if (data.success) {
        setMessages(data.data);
        // Mark as read
        await fetch('/api/messages', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ senderId: partnerId }),
        });
      }
    } catch (_err) {
      console.error('Failed to fetch messages', _err);
    }
  }, []);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchConversations();
    }
  }, [status, fetchConversations]);

  useEffect(() => {
    if (selectedPartner) {
      fetchMessages(selectedPartner.id);
    }
  }, [selectedPartner, fetchMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Poll for new messages
  useEffect(() => {
    if (!selectedPartner) return;
    const interval = setInterval(() => {
      fetchMessages(selectedPartner.id);
      fetchConversations();
    }, 10000);
    return () => clearInterval(interval);
  }, [selectedPartner, fetchMessages, fetchConversations]);

  const handleSend = async () => {
    if (!newMessage.trim() || !selectedPartner) return;
    setError('');

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ receiverId: selectedPartner.id, content: newMessage.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        setMessages((prev) => [...prev, data.data]);
        setNewMessage('');
        fetchConversations();
      } else {
        setError(data.error || 'Failed to send message');
      }
    } catch (_err) {
      setError('Failed to send message');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (status === 'loading') {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-zinc-200 dark:bg-zinc-700 rounded w-1/4" />
        </div>
      </div>
    );
  }

  if (status !== 'authenticated') {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <MessageSquare className="h-12 w-12 text-zinc-300 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">Sign in to view messages</h1>
        <p className="text-zinc-500 mb-6">You need to be signed in to send and receive direct messages.</p>
        <Link href="/" className="text-blue-600 hover:underline">Back to Home</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/" className="text-sm text-blue-600 hover:underline">← Home</Link>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Messages</h1>
      </div>

      <div className="bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 overflow-hidden" style={{ minHeight: '500px' }}>
        <div className="flex h-full" style={{ minHeight: '500px' }}>
          {/* Conversation List */}
          <div className={`${selectedPartner ? 'hidden md:block' : 'block'} w-full md:w-80 border-r border-zinc-200 dark:border-zinc-700`}>
            <div className="p-4 border-b border-zinc-200 dark:border-zinc-700">
              <h2 className="font-semibold text-zinc-900 dark:text-zinc-100">Conversations</h2>
            </div>
            <div className="overflow-y-auto" style={{ maxHeight: '500px' }}>
              {conversations.length === 0 ? (
                <div className="p-6 text-center text-zinc-500 text-sm">
                  <MessageSquare className="h-8 w-8 text-zinc-300 mx-auto mb-2" />
                  No conversations yet
                </div>
              ) : (
                conversations.map((conv) => (
                  <button
                    key={conv.partner.id}
                    onClick={() => setSelectedPartner(conv.partner)}
                    className={`w-full p-4 text-left hover:bg-zinc-50 dark:hover:bg-zinc-700/50 transition-colors border-b border-zinc-100 dark:border-zinc-700 ${
                      selectedPartner?.id === conv.partner.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-600 flex items-center justify-center overflow-hidden shrink-0">
                        {conv.partner.image ? (
                          <img src={conv.partner.image} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <UserIcon className="h-5 w-5 text-zinc-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm text-zinc-900 dark:text-zinc-100 truncate">
                            {conv.partner.name || conv.partner.username || 'Unknown'}
                          </span>
                          {conv.partner.isPro && (
                            <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 px-1.5 py-0.5 rounded">Pro</span>
                          )}
                        </div>
                        <p className="text-xs text-zinc-500 truncate mt-0.5">{conv.lastMessage.content}</p>
                      </div>
                      {conv.unreadCount > 0 && (
                        <span className="bg-blue-600 text-white text-xs rounded-full h-5 min-w-[20px] flex items-center justify-center px-1">
                          {conv.unreadCount}
                        </span>
                      )}
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className={`${selectedPartner ? 'flex' : 'hidden md:flex'} flex-col flex-1`}>
            {selectedPartner ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-zinc-200 dark:border-zinc-700 flex items-center gap-3">
                  <button
                    onClick={() => setSelectedPartner(null)}
                    className="md:hidden p-1 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded"
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </button>
                  <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-600 flex items-center justify-center overflow-hidden">
                    {selectedPartner.image ? (
                      <img src={selectedPartner.image} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <UserIcon className="h-4 w-4 text-zinc-400" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-sm text-zinc-900 dark:text-zinc-100">
                      {selectedPartner.name || selectedPartner.username || 'Unknown'}
                    </p>
                    {selectedPartner.isPro && (
                      <span className="text-xs text-blue-600">Pro</span>
                    )}
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ maxHeight: '400px' }}>
                  {messages.length === 0 ? (
                    <div className="text-center text-zinc-500 text-sm py-8">
                      No messages yet. Say hello!
                    </div>
                  ) : (
                    messages.map((msg) => {
                      const isMine = msg.senderId === (session?.user as any)?.id;
                      return (
                        <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                          <div
                            className={`max-w-[70%] rounded-xl px-4 py-2 text-sm ${
                              isMine
                                ? 'bg-blue-600 text-white rounded-br-md'
                                : 'bg-zinc-100 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 rounded-bl-md'
                            }`}
                          >
                            <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                            <p className={`text-xs mt-1 ${isMine ? 'text-blue-200' : 'text-zinc-400'}`}>
                              {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              {isMine && msg.readAt && ' ✓✓'}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 border-t border-zinc-200 dark:border-zinc-700">
                  {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={handleKeyDown}
                      className="flex-1 px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 text-sm"
                      maxLength={5000}
                    />
                    <button
                      onClick={handleSend}
                      disabled={!newMessage.trim()}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 flex items-center gap-1"
                    >
                      <Send className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-zinc-400">
                <div className="text-center">
                  <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">Select a conversation to start chatting</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
