import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Send, WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSession } from '@/context/AuthContext';
import { Chat, Message } from '../types/Chat';
import { getChatMessages } from '../services/ChatApi';

interface Props {
  chat: Chat;
  messages: Message[];
  onSendMessage: (message: Omit<Message, 'id' | 'fechaHora' | 'estadoLecturaId' | 'autorNombre'>) => void;
  onBack: () => void;
  connected: boolean;
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  hideBackButton?: boolean; // Nueva prop para versión simple
}

export const ChatWindow: React.FC<Props> = ({ 
  chat, 
  messages, 
  onSendMessage, 
  onBack, 
  connected,
  setMessages,
  hideBackButton = false
}) => {
  const { user } = useSession();
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Cargar mensajes del chat al abrir
  useEffect(() => {
    loadMessages();
  }, [chat.id]);

  // Scroll automático al final
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadMessages = async () => {
    if (!user?.usuario?.id) return;
    
    try {
      setLoading(true);
      const response = await getChatMessages(chat.id, parseInt(user.usuario.id), 0, 20);
      setMessages(response.content.reverse()); // Reverse para mostrar cronológicamente
    } catch (error) {
      console.error('Error al cargar mensajes:', error);
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputMessage.trim() || !user?.usuario?.id || !connected) return;

    const message = {
      chatId: chat.id,
      autorId: parseInt(user.usuario.id),
      contenido: inputMessage.trim()
    };

    onSendMessage(message);
    setInputMessage('');
  };

  const formatMessageTime = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const isMyMessage = (message: Message) => {
  if (!user?.usuario?.id) return false;
  return message.autorId === parseInt(user.usuario.id);
};


  return (
    <div className="flex flex-col h-full">
      {/* Header - solo mostrar si no es versión simple */}
      {!hideBackButton && (
        <div className="flex items-center p-3 border-b bg-gray-50">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="h-6 w-6 p-0 mr-2"
          >
            <ArrowLeft size={14} />
          </Button>
          <div className="flex-1">
            <h4 className="text-sm font-medium">Chat #{chat.id}</h4>
            <div className="flex items-center">
              {connected ? (
                <span className="text-xs text-green-600">En línea</span>
              ) : (
                <span className="text-xs text-red-600 flex items-center">
                  <WifiOff size={10} className="mr-1" />
                  Desconectado
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Mensajes */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {loading ? (
          <div className="flex justify-center">
            <span className="text-xs text-gray-500">Cargando mensajes...</span>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex justify-center">
            <span className="text-xs text-gray-500">No hay mensajes</span>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${isMyMessage(message) ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] rounded-lg px-3 py-2 ${
                  isMyMessage(message)
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-800'
                }`}
              >
                <p className="text-sm">{message.contenido}</p>
                <span className={`text-xs ${
                  isMyMessage(message) ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  {formatMessageTime(message.fechaHora)}
                </span>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSendMessage} className="p-3 border-t bg-gray-50">
        <div className="flex gap-2">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={connected ? "Escribe un mensaje..." : "Desconectado"}
            disabled={!connected}
            className="flex-1"
            maxLength={2000}
          />
          <Button
            type="submit"
            size="sm"
            disabled={!connected || !inputMessage.trim()}
          >
            <Send size={14} />
          </Button>
        </div>
        {/* Indicador de conexión en versión simple */}
        {hideBackButton && (
          <div className="mt-1 text-center">
            {connected ? (
              <span className="text-xs text-green-600">En línea</span>
            ) : (
              <span className="text-xs text-red-600 flex items-center justify-center">
                <WifiOff size={10} className="mr-1" />
                Desconectado
              </span>
            )}
          </div>
        )}
      </form>
    </div>
  );
};