import { gql } from "@apollo/client";

export const GET_GRADOS_ACADEMICOS = gql`
  query GetGradosAcademicos {
    getGradosAcademicos {
      id
      nombre
    }
  }
`;

export const GET_ESPECIALIDADES = gql`
  query GetEspecialidades {
    getEspecialidades {
      id
      nombre
    }
  }
`;

export const GET_CARRERA_PROFESIONAL = gql`
  query GetCarrerasProfesionales {
    getCarrerasProfesionales {
      id
      nombre
    }
  }
`;

export const GET_UNIVERSIDAD = gql`
  query GetUniversidades {
    getUniversidades {
      id
      nombre
    }
  }
`;

export const GET_ORCID = gql`
  query GetUserByOrcid($getUserByOrcidId: String!) {
    getUserByOrcid(id: $getUserByOrcidId) {
      orcid
      nombre
      apellido
      url_perfil
      url_linkedin
      publicaciones {
        titulo
        doi
        urlPublicacion
        anioPublicacion
        base_datos
        journal
      }
    }
  }
`;

export const REGISTER_USER = gql`
  mutation Register($registerDto: registerInput!) {
    register(registerDto: $registerDto) {
      token
      usuario {
        id
        nombres
        apellidos
        correo
        carrera_profesional {
          id
          nombre
        }
        descripcion
        linea_investigacion
        orcid
        rol_asesor
        rol_tesista
        especialidades {
          idEspecialidad
          nombreEspecialidad
          aniosExperiencia
        }
        grado_academico {
          id
          nombre
        }
        universidad {
          id
          nombre
        }
        publicaciones {
          titulo
          baseDatosBibliografica
          revista
          anioPublicacion
          urlPublicacion
        }
      }
    }
  }
`;