export interface RecomendationsResponse {
    message:   string;
    recomendaciones: Recomendaciones[];
}

export interface Recomendaciones {
  idInvestigador: number
  idUsuarioRecomendado: number
  puntaje: number
  fecha: string
  tipo: string
}