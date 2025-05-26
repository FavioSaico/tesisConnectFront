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

export interface RecomendacionesUser {
  id: string
  nombres: string
  apellidos: string
  linea_investigacion: string
  rol_asesor: boolean
  puntaje: number
}