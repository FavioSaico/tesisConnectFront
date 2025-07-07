import { GET_USER_AUTHENTICATED } from '@/modules/profile/graphql/getUserProfile'
import { AuthResponse } from '@/types/Usuario'
import { useLazyQuery } from '@apollo/client'
import { createContext, ReactNode, useContext, useEffect, useState, useRef } from 'react'
import SockJS from 'sockjs-client'
import { CompatClient, Stomp } from '@stomp/stompjs'

// Tipos para los mensajes
interface WebSocketMessage {
  id?: number;
  chatId: number;
  autorId: number;
  contenido: string;
  fechaHora?: string;
  estadoLecturaId?: number;
  autorNombre?: string;
}

interface WebSocketError {
  code: string;
  message: string;
  timestamp: number;
}

type SessionContextType = {
  user: AuthResponse | null
  setUserLS: (user: AuthResponse) => Promise<void>
  logout: () => Promise<void>
  isLoading: boolean
  called: boolean
  // Nuevas propiedades para WebSocket
  wsConnected: boolean
  sendMessage: (message: Omit<WebSocketMessage, 'id' | 'fechaHora' | 'estadoLecturaId' | 'autorNombre'>) => void
  newMessages: WebSocketMessage[]
  clearNewMessages: () => void
}

interface UserData {
  getUserAuthenticated: AuthResponse
}

const URL_USUARIO = import.meta.env.VITE_URL_USUARIO;
const CHAT_URL = import.meta.env.VITE_URL_CHAT;

export const SessionContext = createContext<SessionContextType| undefined>(undefined)

export function SessionProvider ({ children } : { children: ReactNode }) {

  const [user, setUser] = useState<AuthResponse| null>(null);
  const [wsConnected, setWsConnected] = useState(false);
  const [newMessages, setNewMessages] = useState<WebSocketMessage[]>([]);
  const stompClientRef = useRef<CompatClient | null>(null);

  const [ getUserAuthenticated, { loading: isLoading, called}] = useLazyQuery<UserData>(GET_USER_AUTHENTICATED);


  useEffect(() => {

    getUserAuthenticatedGql();
  
  }, [])

  // Conectar WebSocket cuando el usuario esté autenticado
  useEffect(() => {
    if (user?.usuario?.id) {
      connectWebSocket();
    } else {
      disconnectWebSocket();
    }
  }, [user]);

  const connectWebSocket = () => {
    if (!user?.usuario?.id || stompClientRef.current) return;

    console.log('🔌 Conectando WebSocket...');
    
    const socket = new SockJS(`${CHAT_URL}/ws`);
    const stompClient = Stomp.over(socket);
    
    stompClient.connect({}, () => {
      console.log('✅ WebSocket conectado globalmente');
      setWsConnected(true);
      stompClientRef.current = stompClient;
      
      // Suscribirse a mensajes
      stompClient.subscribe(`/user/${user!.usuario.id}/queue/mensajes`, (message) => {
        console.log('📨 Nuevo mensaje recibido:', message.body);
        try {
          const newMessage: WebSocketMessage = JSON.parse(message.body);
          setNewMessages(prev => [...prev, newMessage]);
        } catch (error) {
          console.error('Error al parsear mensaje:', error);
        }
      });

      // Suscribirse a errores
      stompClient.subscribe(`/user/${user!.usuario.id}/queue/errores`, (error) => {
        try {
          const errorData: WebSocketError = JSON.parse(error.body);
          console.error('❌ Error WebSocket:', errorData);
        } catch (parseError) {
          console.error('Error al parsear error:', parseError);
        }
      });
    }, (error: unknown) => {
      console.error('❌ Error de conexión WebSocket:', error);
      setWsConnected(false);
    });
  };

  const disconnectWebSocket = () => {
    if (stompClientRef.current) {
      console.log('🔌 Desconectando WebSocket');
      stompClientRef.current.disconnect();
      stompClientRef.current = null;
      setWsConnected(false);
      setNewMessages([]);
    }
  };

  const sendMessage = (message: Omit<WebSocketMessage, 'id' | 'fechaHora' | 'estadoLecturaId' | 'autorNombre'>) => {
    if (stompClientRef.current && wsConnected) {
      console.log('📤 Enviando mensaje:', message);
      stompClientRef.current.send('/app/enviar-mensaje', {}, JSON.stringify(message));
    } else {
      console.warn('⚠️ No se puede enviar mensaje: WebSocket no conectado');
    }
  };

  const clearNewMessages = () => {
    setNewMessages([]);
  };

  const getUserAuthenticatedGql = async () => {
    
    const { data } = await getUserAuthenticated();

    if(data) {
      setUser({
        ...data.getUserAuthenticated
      })
    }else{
      setUser(null)
    }

  }

  const setUserLS = async (user: AuthResponse) => {
    setUser(user);

  }

  const logout = async() => {

    await fetch(`${URL_USUARIO}/api/auth/logout`, {
      method: 'POST',
      credentials: 'include'
    });

    disconnectWebSocket();
    setUser(null)
  }

  return (
    <SessionContext.Provider value={{

      user, 
      setUserLS, 
      logout, 
      isLoading,
      called,
      wsConnected,
      sendMessage,
      newMessages,
      clearNewMessages
    }}>
      {children}
    </SessionContext.Provider>
  )
}


export const useSession = () => {
  const context = useContext(SessionContext)
  if (!context) {
    throw new Error("useUser debe usarse dentro de UserProvider")
  }
  return context
}