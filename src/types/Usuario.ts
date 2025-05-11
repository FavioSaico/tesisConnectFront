export interface AuthResponse {
    token?:   string;
    usuario?: Usuario;
}

export interface Usuario {
    id:                  string;
    nombres:             string;
    apellidos:           string;
    correo:              string;
    descripcion?:         string;
    rol_tesista:         boolean;
    rol_asesor:          boolean;
    orcid?:               string;
    linea_investigacion: string;
    grado_academico:     GradoAcademico;
    carrera_profesional: CarreraProfesional;
    especialidades:      Especialidad[];
    publicaciones:       Publicacion[];
}

export interface Especialidad {
    idEspecialidad:   number;
    nombreEspecialidad: string;
    aniosExperiencia: number;
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