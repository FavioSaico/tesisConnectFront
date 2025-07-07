export interface AuthResponse {
    token:   string;
    usuario: Usuario;
}

export interface Usuario {
    id:                  string;
    nombres:             string;
    apellidos:           string;
    correo:              string;
    descripcion:         string;
    rol_tesista:         boolean;
    rol_asesor:          boolean;
    orcid:               string;
    linea_investigacion: string;
    grado_academico:     GradoAcademico;
    carrera_profesional: CarreraProfesional;
    especialidades:      Especialidad[];
    publicaciones:       Publicacion[];
    universidad:         UniversidadItem
}

export interface Especialidad {
    idEspecialidad:   number;
    nombreEspecialidad: string;
    aniosExperiencia: number;
}

export interface EspecialidadItem {
    id:     string;
    nombre: string;
}

export interface GradoAcademicoItem {
    id:     string;
    nombre: string;
}

export interface CarreraProfesionalItem {
    id:     string;
    nombre: string;
}

export interface UniversidadItem {
    id:     string;
    nombre: string;
}

export interface PublicacionItem {
    titulo: string; 
    baseDatosBibliografica: string; 
    revista: string; 
    anioPublicacion: string; 
    urlPublicacion: string;
}

export interface Orcid {
    orcid: string
    nombre: string
    apellido: string
    url_perfil: string
    url_linkedin?: string
    publicaciones: OrcidWork[]
}

export interface OrcidWork {
    titulo: string,
    doi: string,
    urlPublicacion: string,
    anioPublicacion: string,
    base_datos: string,
    journal: string
}

export interface GradoAcademico {
    id:     number;
    nombre: string;
}

export interface CarreraProfesional {
    id:     number;
    nombre: string;
}

export interface Publicacion {
    titulo:                 string;
    baseDatosBibliografica: string;
    revista:                string;
    anioPublicacion:        number;
    urlPublicacion:         string;
}