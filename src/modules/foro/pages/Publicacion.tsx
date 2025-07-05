import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { DetallePublicacion } from "../components/DetallePublicacion";
import { FormNuevoComentario } from "../components/FormNuevoComentario";
import { ListaComentarios } from "../components/ListaComentarios";
import { Publicacion } from "@/types/Publicacion";
import { Comentario } from "@/types/Comentario";
import { useSession } from "@/context/AuthContext";
import {
  getPublicacionById,
  getComentarios,
  getUsuarioSimple,
} from "../services/ForoApi";

export const PublicacionPage = () => {
  const { id } = useParams();
  const [publicacion, setPublicacion] = useState<Publicacion | null>(null);
  const [nombreAutor, setNombreAutor] = useState<string | undefined>();
  const [comentarios, setComentarios] = useState<Comentario[]>([]);
  const [num_comentarios, setNumComentarios] = useState<number>(0);
  const [usuariosCache, setUsuariosCache] = useState<Map<number, string>>(new Map());
  const [error, setError] = useState<string | null>(null);
  const { user } = useSession();

  // Funcion para cargar publicación
  const cargarPublicacion = async () => {
    if (!id) return;
    try {
      const data = await getPublicacionById(Number(id));
      setPublicacion(data);

      const usuario = await getUsuarioSimple(data.idUsuario);
      setNombreAutor(usuario.nombreCompleto);
    } catch (err) {
      console.error(err);
      setError("No se pudo cargar la publicación");
    }
  };
  // Cargar publicación
  useEffect(() => {
    cargarPublicacion();
  }, [id]);
  // Cargar comentarios
  useEffect(() => {
    const cargarComentarios = async () => {
      if (!id) return;
      try {
        const data = await getComentarios(Number(id));
        setNumComentarios(data.total);
        setComentarios(data.comentarios);
      } catch (err) {
        console.error("Error al obtener comentarios", err);
      }
    };
    cargarComentarios();
  }, [id]);

  // Cargar nombres de usuarios
  useEffect(() => {
    const cargarNombresUsuarios = async () => {
      const nuevos = new Map(usuariosCache);
      
      // Agrega el usuario actual si no existe aún
      if (user?.usuario?.id && !nuevos.has(parseInt(user.usuario.id))) {
        const nombre = `${user.usuario.nombres ?? ""} ${user.usuario.apellidos ?? ""}`.trim();
        nuevos.set(parseInt(user.usuario.id), nombre);
      }

      const recolectarIds = (comentarios: Comentario[]) => {
        for (const c of comentarios) {
          if (!nuevos.has(c.idUsuario)) nuevos.set(c.idUsuario, "Cargando...");
          if (c.respuestas?.length > 0) recolectarIds(c.respuestas);
        }
      };

      recolectarIds(comentarios);

      for (const [id, nombre] of nuevos.entries()) {
        if (nombre === "Cargando...") {
          try {
            const { nombreCompleto } = await getUsuarioSimple(id);
            nuevos.set(id, nombreCompleto);
          } catch {
            nuevos.set(id, "Usuario desconocido");
          }
        }
      }

      setUsuariosCache(new Map(nuevos));
    };

    cargarNombresUsuarios();

  }, [comentarios]);

  if (error) {
    return <p className="text-red-500 text-center">{error}</p>;
  }

  if (!publicacion) {
    return <p className="text-center">Cargando publicación...</p>;
  }
  return (
    <div className="space-y-4">
      <DetallePublicacion
        publicacion={publicacion}
        nombreAutor={nombreAutor}
      />

      <FormNuevoComentario
        idPublicacion={publicacion.idPublicacion}
        onComentarioCreado={async () => {
          const data = await getComentarios(publicacion.idPublicacion);
          setComentarios(data.comentarios);
        }}
      />

      <ListaComentarios
        comentarios={comentarios}
        total={num_comentarios}
        usuarios={usuariosCache}
        onComentarioCreado={async () => {
          const data = await getComentarios(publicacion.idPublicacion);
          setComentarios(data.comentarios);
          await cargarPublicacion();
        }}
        idRespuestaOficial={publicacion.idComentarioRespuesta}
        idUsuarioPublicacion={publicacion.idUsuario}
      />
    </div>
  );
};