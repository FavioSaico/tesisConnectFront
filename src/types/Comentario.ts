export interface Comentario {
  idComentario: string;
  idUsuario: number;
  idPublicacion: number;
  contenido: string;
  fechaCreacion: string;
  respuestas: Comentario[];
}

export type NuevoComentario = {
  contenido: string;
  idUsuario: number;
  idComentarioPadre: string | null;
};