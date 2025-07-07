import { useState, useEffect } from 'react';
import { MessageCircle, X, Minus, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSession } from '@/context/AuthContext';
import { ChatWindow } from './ChatWindow';
import { findOrCreateChat, getUsuarioSimple } from '../services/ChatApi';
import { useChat } from '../hooks/UseChat';
import { Chat } from '../types/Chat';

interface ChatFloatingProps {
  targetUserId?: string;
}

interface OpenChatEvent extends CustomEvent {
  detail: { userId: string };
}

export const ChatFloating: React.FC<ChatFloatingProps> = ({ targetUserId }) => {
  const { user, newMessages } = useSession();
  const { connected, messages, sendMessage, setMessages, setActiveChat } = useChat();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [activeChat, setActiveChatState] = useState<Chat | null>(null);
  const [chatPartnerName, setChatPartnerName] = useState<string>('');
  const [loading, setLoading] = useState(false);

  // Abrir chat directo si se pasa targetUserId
  useEffect(() => {
    if (targetUserId && user?.usuario?.id) {
      handleStartDirectChat(parseInt(targetUserId));
    }
  }, [targetUserId, user]);

  // Escuchar evento global para abrir chat (con tu estilo de tipos)
  useEffect(() => {
    const handleOpenChat = (event: OpenChatEvent) => {
      const { userId } = event.detail;
      if (userId) {
        handleStartDirectChat(parseInt(userId));
      }
    };

    const listener = handleOpenChat as EventListener;

    window.addEventListener('openChat', listener);
    return () => {
      window.removeEventListener('openChat', listener);
    };
  }, [user]);

  const handleStartDirectChat = async (targetUserId: number) => {
    if (!user?.usuario?.id) return;

    try {
      setLoading(true);
      
      const chat = await findOrCreateChat(parseInt(user.usuario.id), targetUserId);
      const partner = await getUsuarioSimple(targetUserId);
      
      setActiveChatState(chat);
      setChatPartnerName(partner.nombreCompleto);
      setIsOpen(true);
      setIsMinimized(false);
      
      // Activar este chat en el hook
      setActiveChat(chat.id);
      
    } catch (error) {
      console.error('Error al crear chat:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setActiveChatState(null);
    setChatPartnerName('');
    setMessages([]);
  };

  if (!user) return null;

  // Contar mensajes nuevos (no del chat activo)
  const unreadCount = newMessages.filter(msg => 
    !activeChat || msg.chatId !== activeChat.id
  ).length;

  return (
    <>
      {/* Botón flotante con indicador */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50">
          <Button
            onClick={() => setIsOpen(true)}
            className="relative rounded-full w-14 h-14 p-0 shadow-lg"
          >
            <MessageCircle size={24} />
            {unreadCount > 0 && (
              <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                {unreadCount > 9 ? '9+' : unreadCount}
              </div>
            )}
          </Button>
        </div>
      )}

      {/* Chat flotante */}
      {isOpen && (
        <div className={`fixed bottom-6 right-6 z-50 bg-white border rounded-lg shadow-xl transition-all ${
          isMinimized ? 'h-12' : 'h-96 w-80'
        }`}>
          {/* Header */}
          <div className="flex justify-between items-center p-3 border-b bg-gray-50 rounded-t-lg">
            <div className="flex items-center gap-2">
              {activeChat ? (
                <>
                  <User size={16} />
                  <h3 className="font-semibold text-sm truncate">
                    {chatPartnerName || `Chat #${activeChat.id}`}
                  </h3>
                </>
              ) : (
                <h3 className="font-semibold text-sm">Chat</h3>
              )}
            </div>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(!isMinimized)}
                className="h-6 w-6 p-0"
              >
                <Minus size={12} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClose}
                className="h-6 w-6 p-0"
              >
                <X size={12} />
              </Button>
            </div>
          </div>

          {/* Contenido */}
          {!isMinimized && (
            <div className="h-80 flex flex-col">
              {activeChat ? (
                <ChatWindow
                  chat={activeChat}
                  messages={messages}
                  onSendMessage={sendMessage}
                  onBack={() => {}}
                  connected={connected}
                  setMessages={setMessages}
                  hideBackButton={true}
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-500 p-4">
                  <MessageCircle size={40} className="mb-2" />
                  <p className="text-sm text-center">
                    {loading ? 'Abriendo chat...' : 'Haz clic en "Mensaje" desde un perfil para empezar a chatear'}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
};