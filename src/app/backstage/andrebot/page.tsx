'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { BackstageGuard } from '@/components/auth/BackstageGuard';
interface ChatListItem {
  id: string;
  creado_por_email: string;
  creado_por_nombre: string | null;
  proyecto_id: string | null;
  created_at: string;
  updated_at: string;
}

interface ChatMessage {
  role: 'user' | 'bot';
  text: string;
  action?: string;
  ticketId?: string;
  imageUrl?: string;
  storeLogo?: string;
  storeName?: string;
  ticketsExistentes?: { id: string; estadoLabel: string; titulo?: string }[];
}

interface ChatDetail {
  id: string;
  creado_por_email: string;
  creado_por_nombre: string | null;
  proyecto_id: string | null;
  messages: ChatMessage[];
}

const POLL_INTERVAL_MS = 2500;

export default function BackstageAndrebotPage() {
  const [chats, setChats] = useState<ChatListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [chatDetail, setChatDetail] = useState<ChatDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchChats = useCallback(() => {
    setLoading(true);
    fetch('/api/backstage/ayuda/chats')
      .then((res) => res.json())
      .then((data: { chats?: ChatListItem[] }) => {
        setChats(Array.isArray(data.chats) ? data.chats : []);
      })
      .catch(() => setChats([]))
      .finally(() => setLoading(false));
  }, []);

  const fetchChatDetail = useCallback((id: string) => {
    setDetailLoading(true);
    fetch(`/api/ayuda/chats/${id}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data: ChatDetail | null) => setChatDetail(data))
      .catch(() => setChatDetail(null))
      .finally(() => setDetailLoading(false));
  }, []);

  useEffect(() => {
    fetchChats();
  }, [fetchChats]);

  useEffect(() => {
    if (selectedId) {
      fetchChatDetail(selectedId);
    } else {
      setChatDetail(null);
    }
  }, [selectedId, fetchChatDetail]);

  // Poll para tiempo real: refrescar mensajes del chat seleccionado cada POLL_INTERVAL_MS
  useEffect(() => {
    if (!selectedId) return;
    const interval = setInterval(() => {
      fetch(`/api/ayuda/chats/${selectedId}`)
        .then((res) => (res.ok ? res.json() : null))
        .then((data: ChatDetail | null) => {
          if (data && data.messages) setChatDetail((prev) => (prev?.id === data.id ? { ...prev, messages: data.messages } : prev));
        })
        .catch(() => {});
    }, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [selectedId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatDetail?.messages?.length]);

  return (
    <BackstageGuard>
      <div className="min-h-screen bg-[var(--bg)]">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-[var(--text)] mb-1">Andrebot</h1>
              <p className="text-sm text-[var(--text-muted)]">
                Chats en vivo · Lo que escriben los usuarios y las respuestas del bot
              </p>
            </div>
            <button
              onClick={() => { fetchChats(); if (selectedId) fetchChatDetail(selectedId); }}
              className="px-3 py-1.5 rounded-lg text-sm border border-[var(--border)] hover:bg-[var(--bg-secondary)] text-[var(--text-muted)] hover:text-[var(--text)]"
            >
              Actualizar
            </button>
          </div>

          <div className="rounded-xl border border-[var(--border)] overflow-hidden flex flex-col lg:flex-row" style={{ minHeight: '60vh' }}>
            {/* Lista de chats */}
            <div className="lg:w-80 shrink-0 border-b lg:border-b-0 lg:border-r border-[var(--border)] bg-[var(--bg-secondary)]/30">
              <div className="p-3 border-b border-[var(--border)]">
                <p className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">Conversaciones</p>
              </div>
              <div className="overflow-y-auto max-h-[50vh] lg:max-h-none lg:h-[calc(60vh-52px)]">
                {loading ? (
                  <div className="p-4 space-y-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="h-14 rounded-lg bg-[var(--border)]/50 animate-pulse" />
                    ))}
                  </div>
                ) : chats.length === 0 ? (
                  <div className="p-6 text-center text-sm text-[var(--text-muted)]">
                    Aún no hay chats. Se crean cuando alguien escribe en Andrebot.
                  </div>
                ) : (
                  <ul className="divide-y divide-[var(--border)]">
                    {chats.map((chat) => {
                      const isSelected = selectedId === chat.id;
                      return (
                        <li key={chat.id}>
                          <button
                            type="button"
                            onClick={() => setSelectedId(chat.id)}
                            className={`w-full text-left p-3 hover:bg-[var(--bg)]/50 transition-colors ${isSelected ? 'bg-[var(--bg)] border-l-2 border-l-[var(--accent)]' : ''}`}
                          >
                            <p className="text-sm font-medium text-[var(--text)] truncate">
                              {chat.creado_por_nombre || chat.creado_por_email || 'Sin nombre'}
                            </p>
                            <p className="text-xs text-[var(--text-muted)] truncate">{chat.creado_por_email}</p>
                            <p className="text-[10px] text-[var(--text-muted)] mt-0.5">
                              {formatDistanceToNow(new Date(chat.updated_at), { addSuffix: true, locale: es })}
                            </p>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            </div>

            {/* Mensajes del chat seleccionado */}
            <div className="flex-1 flex flex-col min-w-0 bg-[var(--bg)]">
              {!selectedId ? (
                <div className="flex-1 flex items-center justify-center p-12 text-center text-[var(--text-muted)]">
                  <p>Seleccioná un chat para ver la conversación en vivo.</p>
                </div>
              ) : detailLoading && !chatDetail ? (
                <div className="flex-1 flex items-center justify-center p-12">
                  <div className="animate-pulse text-[var(--text-muted)]">Cargando...</div>
                </div>
              ) : chatDetail ? (
                <>
                  <div className="p-4 border-b border-[var(--border)] bg-[var(--bg-secondary)]/30">
                    <p className="text-sm font-medium text-[var(--text)]">
                      {chatDetail.creado_por_nombre || chatDetail.creado_por_email}
                    </p>
                    <p className="text-xs text-[var(--text-muted)]">{chatDetail.creado_por_email}</p>
                    <p className="text-[10px] text-[var(--text-muted)] mt-1">
                      Actualización automática cada {POLL_INTERVAL_MS / 1000}s
                    </p>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
                    {chatDetail.messages.length === 0 ? (
                      <p className="text-sm text-[var(--text-muted)]">Sin mensajes aún.</p>
                    ) : (
                      chatDetail.messages.map((msg, index) => (
                        <div
                          key={index}
                          className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[85%] rounded-2xl px-4 py-2.5 ${
                              msg.role === 'user'
                                ? 'bg-[var(--accent)] text-white'
                                : 'bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text)]'
                            }`}
                          >
                            {msg.imageUrl && (
                              <a
                                href={msg.imageUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block mb-2 rounded-lg overflow-hidden border border-[var(--border)]"
                              >
                                <img src={msg.imageUrl} alt="" className="max-w-full h-auto max-h-48 object-contain" />
                              </a>
                            )}
                            <p className="text-sm whitespace-pre-wrap break-words">{msg.text}</p>
                            {msg.action && (
                              <p className="text-[10px] opacity-80 mt-1">Acción: {msg.action}</p>
                            )}
                            {msg.ticketId && (
                              <Link
                                href={`/backstage/ticket/${msg.ticketId}`}
                                className="inline-flex items-center gap-1 mt-2 text-xs font-medium underline"
                              >
                                Ver ticket →
                              </Link>
                            )}
                            {msg.ticketsExistentes && msg.ticketsExistentes.length > 0 && (
                              <div className="mt-2 space-y-1">
                                {msg.ticketsExistentes.map((t) => (
                                  <Link
                                    key={t.id}
                                    href={`/backstage/ticket/${t.id}`}
                                    className="block text-xs underline"
                                  >
                                    {t.titulo || t.estadoLabel || t.id}
                                  </Link>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center p-12 text-[var(--text-muted)]">
                  No se pudo cargar el chat.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </BackstageGuard>
  );
}
