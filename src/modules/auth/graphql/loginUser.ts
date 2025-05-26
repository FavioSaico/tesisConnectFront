import { gql } from "@apollo/client";

export const LOGIN_USER = gql`
  mutation login($loginDto: loginInput!) {
    login(loginDto: $loginDto) {
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
      }
    }
  }
`;