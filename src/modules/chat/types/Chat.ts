export interface Chat {
  id: number;
  estadoId: number;
  ultimoMensajeId?: number;
  ultimoMensajeContenido?: string;
  ultimoMensajeFecha?: string;
}

export interface Message {
  id?: number;
  chatId: number;
  autorId: number;
  contenido: string;
  fechaHora?: string;
  estadoLecturaId?: number;
  autorNombre?: string;
}

export interface CreateChatRequest {
  participantesIds: number[];
  tipoChat: string;
}