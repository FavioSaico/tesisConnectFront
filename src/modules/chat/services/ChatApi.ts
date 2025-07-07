import { Chat, Message } from '../types/Chat';

const CHAT_URL = import.meta.env.VITE_URL_CHAT;

export async function getUserChats(userId: number): Promise<Chat[]> {
  const res = await fetch(`${CHAT_URL}/api/chats/usuario/${userId}`);
  if (!res.ok) {
    throw new Error("Error al cargar chats");
  }
  return await res.json();
}

export async function findOrCreateChat(usuario1Id: number, usuario2Id: number): Promise<Chat> {
  const res = await fetch(`${CHAT_URL}/api/chats/entre-usuarios?usuario1Id=${usuario1Id}&usuario2Id=${usuario2Id}`);
  if (!res.ok) {
    throw new Error("Error al crear chat");
  }
  return await res.json();
}

export async function getChatMessages(chatId: number, userId: number, page = 0, size = 20): Promise<{content: Message[], totalElements: number}> {
  const res = await fetch(`${CHAT_URL}/api/chats/${chatId}/mensajes?usuarioId=${userId}&page=${page}&size=${size}`);
  if (!res.ok) {
    throw new Error("Error al cargar mensajes");
  }
  return await res.json();
}

export async function getUsuarioSimple(id: number): Promise<{ nombreCompleto: string }> {
  const res = await fetch(`${import.meta.env.VITE_URL_USUARIO}/graphql`, {
    method: "POST",
    credentials: 'include',
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: `
        query GetUser($getUserId: Int!) {
          getUser(id: $getUserId) {
            nombres
            apellidos
          }
        }
      `,
      variables: {
        getUserId: id
      }
    })
  });

  const json = await res.json();
  if (json.errors || !json.data?.getUser) {
    throw new Error("Error al obtener usuario");
  }

  const data = json.data.getUser;
  return { nombreCompleto: `${data.nombres} ${data.apellidos}` };
}