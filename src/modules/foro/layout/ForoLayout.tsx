import { Outlet } from "react-router";
import { useState, useEffect } from "react";
import { FiltroPublicaciones, FiltroValues } from "../components/FiltroPublicaciones";
import { Categoria, Estado} from "@/types/Publicacion";
import { getCategorias, getEstados } from "../services/ForoApi";
import { OptionsUser } from "@/modules/profile/components/OptionsUser";
import logo from "/logo_ico.png";
import filtrar_ico from "/filtrar_ico.png";
import { Searcher } from "@/modules/profile/components/Searcher";
import { X } from "lucide-react";

export const ForoLayout = () => {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [estados, setEstados] = useState<Estado[]>([]);
  const [filtros, setFiltros] = useState<FiltroValues | null>(null);
  const [mostrarFiltro, setMostrarFiltro] = useState(false);

  const cargarCategorias = async () => {
    try {
      const data = await getCategorias();
      setCategorias(data);
    } catch (err) {
      console.error("Error al obtener categorías");
    }
  };

  // Cargar estados
  const cargarEstados = async () => {
    try {
      const data = await getEstados();
      setEstados(data);
    } catch (err) {
      console.error("Error al obtener estados");
    }
  };

  useEffect(() => {
    cargarCategorias();
    cargarEstados();
  }, []);

  useEffect(() => {
    if (mostrarFiltro) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    // Limpieza de seguridad al desmontar o cambiar de estado
    return () => {
      document.body.style.overflow = "";
    };
  }, [mostrarFiltro]);

  return (
    <div className="mb-10 max-w-7xl mx-auto">
      <header className="sticky top-0 z-50 bg-white w-full flex justify-between items-center pt-5 pb-7.5 px-4">
        <div className="logo_container max-w-14">
          <img src={logo} alt="logo_tesisconnect" className="w-full" />
        </div>
        <Searcher/>
        <OptionsUser />
      </header>

      {/* Contenido principal + filtro lateral */}
      <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_320px] gap-x-10 gap-y-6 px-4">
        {/* Botón flotante solo para móviles */}
        <div className="fixed bottom-6 right-6 z-40 md:hidden">
          <button
            onClick={() => setMostrarFiltro(true)}
            className="bg-blue-600 text-white p-3 rounded-full shadow-xl/30 "
            aria-label="Mostrar filtros"
          >
            <div className="logo_container max-w-7">
              <img src={filtrar_ico} alt="logo_filtrar" className="w-full" />
            </div>
          </button>
        </div>

        {/* Página interna del foro */}
        <Outlet context={{ filtros }} />

        {/* Filtro lateral solo visible en escritorio */}
        <div className="hidden md:block">
          <div className="sticky top-23 w-full max-w-xs">
            <FiltroPublicaciones
              categorias={categorias}
              estados={estados}
              onFiltrar={setFiltros}
            />
          </div>
        </div>
      </div>

      {/*Modal de filtro en móvil */}
      {mostrarFiltro && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex justify-center items-center px-4"
          onClick={() => setMostrarFiltro(false)}
        >
          <div
            className="relative bg-white rounded-xl w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setMostrarFiltro(false)}
              className="absolute top-5 right-4 text-black font-bold text-2xl"
            >
              <X />
            </button>

            <FiltroPublicaciones
              categorias={categorias}
              estados={estados}
              initialValues={filtros || undefined}
              onFiltrar={(f) => {
                setFiltros(f);
                setMostrarFiltro(false);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};