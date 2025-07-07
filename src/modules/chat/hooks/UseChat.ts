import { useState, useEffect } from 'react';
import { useSession } from '@/context/AuthContext';
import { Message } from '../types/Chat';

export const useChat = () => {
  const { wsConnected, sendMessage: sendGlobalMessage, newMessages, clearNewMessages } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentChatId, setCurrentChatId] = useState<number | null>(null);

  // Filtrar mensajes para el chat actual
  useEffect(() => {
    if (currentChatId && newMessages.length > 0) {
      const chatMessages = newMessages.filter(msg => msg.chatId === currentChatId);
      if (chatMessages.length > 0) {
        setMessages(prev => [...prev, ...chatMessages]);
        clearNewMessages();
      }
    }
  }, [newMessages, currentChatId, clearNewMessages]);

  const sendMessage = (message: Omit<Message, 'id' | 'fechaHora' | 'estadoLecturaId' | 'autorNombre'>) => {
    sendGlobalMessage(message);
  };

  const setActiveChat = (chatId: number) => {
    setCurrentChatId(chatId);
    setMessages([]);
  };

  return {
    connected: wsConnected,
    messages,
    sendMessage,
    setMessages,
    setActiveChat,
    newMessages: newMessages.filter(msg => !currentChatId || msg.chatId !== currentChatId)
  };
};