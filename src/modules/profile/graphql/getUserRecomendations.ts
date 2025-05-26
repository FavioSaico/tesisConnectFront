import { gql } from "@apollo/client";

export const GET_RECOMMENDED_USERS = gql`
  query GetUsers($ids: [Int]!) {
    getUsers(ids: $ids) {
      id
      nombres
      apellidos
      rol_tesista
      rol_asesor
      linea_investigacion
    }
  }
`;