import { useOutletContext } from "react-router";
import { useEffect, useState } from "react";
import { getPublicaciones, getUsuarioSimple, getCategorias } from "../services/ForoApi";
import { Publicacion, Categoria } from "@/types/Publicacion";
import { PublicacionCard } from "../components/PublicacionCard";
import { FormNuevaPublicacion } from "../components/FormNuevaPublicacion";
import { FiltroValues } from "../components/FiltroPublicaciones";
import { Loader2 } from "lucide-react";

type ContextType = { filtros: FiltroValues};

export const ForoPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [publicaciones, setPublicaciones] = useState<Publicacion[]>([]);
  const [usuariosCache, setUsuariosCache] = useState<Map<number, string>>(new Map());
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [error, setError] = useState("");
  const { filtros } = useOutletContext<ContextType>();
  const filtrosActivos = filtros ?? {
    texto: "",
    categorias: [],
    estados: "todos",
    ordenar: "",
  };

  // Cargar publicaciones
  const cargarPublicaciones = async () => {
    try {
      setIsLoading(true)
      const data = await getPublicaciones({});
      setPublicaciones(data);

      setIsLoading(false)
    } catch (err) {
      setError("Error al obtener publicaciones");
      console.error(err);
    }
  };

  const cargarCategorias = async () => {
      try {
        const data = await getCategorias();
        setCategorias(data);
      } catch (err) {
        console.error("Error al obtener categorías");
      }
    };

  useEffect(() => {
    cargarPublicaciones();
    cargarCategorias();
  }, []);

  // Cargar nombres de usuarios únicos
  useEffect(() => {
    const cargarNombres = async () => {
      const nuevos = new Map(usuariosCache);
      for (const pub of publicaciones) {
        const id = pub.idUsuario;
        if (!nuevos.has(id)) {
          try {
            const { nombreCompleto } = await getUsuarioSimple(id);
            nuevos.set(id, nombreCompleto);
          } catch (err) {
            console.warn("No se pudo obtener el nombre del usuario ${id}");
          }
        }
      }
      setUsuariosCache(nuevos);
    };

    if (publicaciones.length > 0) {
      cargarNombres();
    }
  }, [publicaciones]);

  // Aplicar filtros
  const publicacionesFiltradas = publicaciones
    .filter((p) =>
      filtrosActivos.texto
        ? p.titulo.toLowerCase().includes(filtrosActivos.texto.toLowerCase()) ||
          p.contenido.toLowerCase().includes(filtrosActivos.texto.toLowerCase())
        : true
    )
    .filter((p) =>
      filtrosActivos.categorias.length > 0
        ? filtrosActivos.categorias.includes(p.idCategoria.toString())
        : true
    )
    .filter((p) =>
      filtrosActivos.estados !== "todos"
        ? p.idEstado.toString() === filtrosActivos.estados
        : true
    )
    .sort((a, b) => {
      const fechaA = new Date(a.fechaCreacion).getTime();
      const fechaB = new Date(b.fechaCreacion).getTime();
      if (filtrosActivos.ordenar === "recientes") return fechaB - fechaA;
      if (filtrosActivos.ordenar === "antiguos") return fechaA - fechaB;
      return 0;
    });

    console.log(isLoading)

  return (
    <>
      <div className="space-y-4">
        <FormNuevaPublicacion
          categorias={categorias}
          onPublicar={cargarPublicaciones}
        />

        {error && <p className="text-red-500">{error}</p>}

        {
          isLoading ? 
          (<div className="userSection md:col-span-2 flex flex-col gap-3">
            <Loader2 className="animate-spin text-primary mx-auto" size={40}/>
          </div>)
          : (
            <>
            {publicacionesFiltradas.map((p) => (
              <PublicacionCard
                key={p.idPublicacion}
                publicacion={p}
                nombreAutor={usuariosCache.get(p.idUsuario)}
              />
            ))}
            </>
          )
        }

        
      </div>
    </>
  );
};