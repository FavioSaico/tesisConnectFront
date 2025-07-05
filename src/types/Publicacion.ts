export interface Publicacion {
  idPublicacion:  number;
  titulo:         string;
  contenido:      string;
  idEstado:       number;
  idCategoria:    number;
  fechaCreacion:  string;
  idUsuario:      number;
  idComentarioRespuesta: string | null;
}

export type NuevaPublicacion = {
  titulo:         string;
  contenido:      string;
  idCategoria:    number;
  idUsuario:      number;
};

export interface Categoria {
  id:             number;
  nombre:         string;
}

export interface Estado {
  id:             number;
  tipo:           string;
}

export interface FiltroPublicaciones {
  texto?:         string;
  id_categoria?:  number[];
  id_estado?:     number[];
  ordenar?:       "recientes" | "antiguos";
}