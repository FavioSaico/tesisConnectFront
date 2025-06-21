import { Outlet } from "react-router";
import { useState, useEffect } from "react";
import { FiltroPublicaciones, FiltroValues } from "../components/FiltroPublicaciones";
import { Categoria, Estado} from "@/types/Publicacion";
import { getCategorias, getEstados } from "../services/ForoApi";
import { OptionsUser } from "@/modules/profile/components/OptionsUser";
import logo from "/logo_ico.png";

export const ForoLayout = () => {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [estados, setEstados] = useState<Estado[]>([]);
  const [filtros, setFiltros] = useState<FiltroValues | null>(null);

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

  return (
    <div className="mb-10 max-w-7xl mx-auto">
      <header className="sticky top-0 z-50 bg-white w-full flex justify-between items-center pt-5 pb-7.5">
        <div className="logo_container max-w-14">
          <img src={logo} alt="logo_tesisconnect" className="w-full" />
        </div>
        <h1 className="text-3xl font-bold text-blue-950">Foro Académico</h1>
        <OptionsUser />
      </header>

      <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_320px] gap-x-15 px-1">  
        <Outlet context={{ filtros }} />

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
    </div>
  );
};