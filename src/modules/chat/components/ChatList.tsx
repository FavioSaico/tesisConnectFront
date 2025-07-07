import { RefreshCw, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Chat } from '../types/Chat';

interface Props {
  chats: Chat[];
  loading: boolean;
  onChatSelect: (chat: Chat) => void;
  onRefresh: () => void;
}

export const ChatList: React.FC<Props> = ({ chats, loading, onChatSelect, onRefresh }) => {
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) {
      return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    } else if (days === 1) {
      return 'Ayer';
    } else if (days < 7) {
      return `${days} días`;
    } else {
      return date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <RefreshCw className="animate-spin" size={20} />
      </div>
    );
  }

  if (chats.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500 p-4">
        <User size={40} className="mb-2" />
        <p className="text-sm text-center">No tienes conversaciones</p>
        <p className="text-xs text-center">Conecta con otros usuarios para empezar a chatear</p>
        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          className="mt-2"
        >
          <RefreshCw size={12} className="mr-1" />
          Actualizar
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header con botón refresh */}
      <div className="flex justify-between items-center p-2 border-b">
        <span className="text-sm font-medium">Conversaciones</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={onRefresh}
          className="h-6 w-6 p-0"
        >
          <RefreshCw size={12} />
        </Button>
      </div>

      {/* Lista de chats */}
      <div className="flex-1 overflow-y-auto">
        {chats.map((chat) => (
          <div
            key={chat.id}
            onClick={() => onChatSelect(chat)}
            className="flex items-center p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
          >
            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center mr-3">
              <User size={16} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start">
                <p className="text-sm font-medium truncate">
                  Chat #{chat.id}
                </p>
                <span className="text-xs text-gray-500">
                  {formatDate(chat.ultimoMensajeFecha)}
                </span>
              </div>
              <p className="text-xs text-gray-500 truncate">
                {chat.ultimoMensajeContenido || 'Sin mensajes'}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};