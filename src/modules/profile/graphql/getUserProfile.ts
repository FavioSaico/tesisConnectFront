import { gql } from "@apollo/client";

export const GET_USER = gql`
  query GetUser($getUserId: Int!) {
    getUser(id: $getUserId) {
      id
      nombres
      apellidos
      correo
      descripcion
      rol_tesista
      rol_asesor
      orcid
      linea_investigacion
      universidad {
        id
        nombre
      }
      grado_academico {
        id
        nombre
      }
      carrera_profesional {
        id
        nombre
      }
      especialidades {
        idEspecialidad
        nombreEspecialidad
        aniosExperiencia
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
`;

export const GET_USER_AUTHENTICATED = gql`
  query GetUserAuthenticated {
    getUserAuthenticated {
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
        publicaciones {
          titulo
          baseDatosBibliografica
          revista
          anioPublicacion
          urlPublicacion
        }
        universidad {
          id
          nombre
        }
      }
    }
  }
`;