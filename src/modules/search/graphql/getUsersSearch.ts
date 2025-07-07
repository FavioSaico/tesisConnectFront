import { gql } from "@apollo/client";

export const GET_USERS_SEARCH = gql`
  query GetUsersSearch($term: String) {
    getUsersSearch(term: $term) {
      id
      nombres
      apellidos
      carrera_profesional {
        id
        nombre
      }
      correo
      descripcion
      especialidades {
        idEspecialidad
        nombreEspecialidad
        aniosExperiencia
      }
      orcid
      rol_asesor
      rol_tesista
      linea_investigacion
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
      grado_academico {
        id
        nombre
      }
    }
  }
`;