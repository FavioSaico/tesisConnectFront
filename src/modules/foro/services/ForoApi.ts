import { Publicacion, NuevaPublicacion, Categoria, Estado, FiltroPublicaciones } from "@/types/Publicacion";
import { Comentario, NuevoComentario } from "@/types/Comentario";

export async function getPublicaciones(filtros: FiltroPublicaciones): Promise<Publicacion[]> {
  const params = new URLSearchParams();

  if (filtros.texto) params.append("texto", filtros.texto);
  if (filtros.id_categoria && filtros.id_categoria.length > 0) {
    filtros.id_categoria.forEach(cat => params.append("id_categoria", String(cat)));
  }
  if (filtros.id_estado && filtros.id_estado.length > 0) {
    filtros.id_estado.forEach(est => params.append("id_estado", String(est)));
  }

  if (filtros.ordenar === "recientes") {
    params.append("orden", "recientes");
  } else if (filtros.ordenar === "antiguos") {
    params.append("orden", "antiguos");
  }

  const res = await fetch(`${import.meta.env.VITE_URL_FORO}/publicaciones/?${params.toString()}`);
  if (!res.ok) {
    throw new Error("Error al cargar publicaciones");
  }
  return await res.json();
}

export async function getPublicacionById(id: number): Promise<Publicacion> {
  const res = await fetch(`${import.meta.env.VITE_URL_FORO}/publicaciones/${id}`);

  if (!res.ok) {
    const errorData = await res.text();
    console.error("Error al obtener la publicación:", errorData);
    throw new Error("No se pudo obtener la publicación");
  }

  return await res.json();
}

export async function getCategorias(): Promise<Categoria[]> {
  const res = await fetch(`${import.meta.env.VITE_URL_FORO}/filtros/categorias/`);
  if (!res.ok) {
    throw new Error("Error al cargar las categorías");
  }
  return await res.json();
}

export async function getEstados(): Promise<Estado[]> {
  const res = await fetch(`${import.meta.env.VITE_URL_FORO}/filtros/estados/`);
  if (!res.ok) {
    throw new Error("Error al cargar los estados");
  }
  return await res.json();
}

export async function getUsuarioSimple(id: number): Promise<{ nombreCompleto: string }> {
  const res = await fetch(`${import.meta.env.VITE_URL_USUARIO}/graphql`, {
    method: "POST",
    credentials: 'include',
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: `
        query GetUser($getUserId: Int!) {
          getUser(id: $getUserId) {
            nombres
            apellidos
          }
        }
      `,
      variables: {
        getUserId: id
      }
    })
  });

  const json = await res.json();

  if (json.errors || !json.data?.getUser) {
    console.error("GraphQL Error:", json.errors || "No se encontró el usuario");
    throw new Error("Error al obtener usuario");
  }

  const data = json.data.getUser;
  return { nombreCompleto: `${data.nombres} ${data.apellidos}` };
}

export async function crearPublicacion(data: NuevaPublicacion): Promise<void> {
  const res = await fetch(`${import.meta.env.VITE_URL_FORO}/publicaciones/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    let errorMsg = "No se pudo crear la publicación";

    try {
      const text = await res.text();
      if (text) {
        const json = JSON.parse(text);
        errorMsg = json.message || JSON.stringify(json);
      }
    } catch (_) {
      // Si falla el parseo, deja el mensaje por defecto
    }
    console.error("Error al crear publicación:", errorMsg);
    throw new Error(errorMsg);
  }
}

export async function crearComentario(idPublicacion: number, data: NuevoComentario): Promise<void> {
  const res = await fetch(
    `${import.meta.env.VITE_URL_FORO}/publicaciones/${idPublicacion}/comentarios`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );
  if (!res.ok) {
    const errorText = await res.text();
    console.error("Error al crear comentario:", errorText);
    throw new Error("No se pudo crear el comentario");
  }
}

export async function getComentarios(publicacionId: number): Promise<{total: number, comentarios: Comentario[]}> {
  const res = await fetch(`${import.meta.env.VITE_URL_FORO}/publicaciones/${publicacionId}/comentarios`);
  if (!res.ok) throw new Error("Error al obtener comentarios");
  const data = await res.json();
  return data;
}

export async function marcarComentario(idPublicacion: number, idComentario: String): Promise<void> {
  const res = await fetch(
    `${import.meta.env.VITE_URL_FORO}/publicaciones/${idPublicacion}/comentarios/${idComentario}/marcar_respuesta`, 
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    }
  )
  if (!res.ok) {
    const errorText = await res.text();
    console.error("Error al marcar comentario:", errorText);
    throw new Error("No se pudo marcar el comentario");
  }
}

export async function desmarcarComentario(idPublicacion: number): Promise<void> {
  const res = await fetch(
    `${import.meta.env.VITE_URL_FORO}/publicaciones/${idPublicacion}/desmarcar_respuesta`, 
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    }
  )
  if (!res.ok) {
    const errorText = await res.text();
    console.error("Error al desmarcar comentario:", errorText);
    throw new Error("No se pudo desmarcar el comentario");
  }
}