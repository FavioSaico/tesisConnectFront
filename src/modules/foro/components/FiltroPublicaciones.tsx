import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Categoria, Estado } from "@/types/Publicacion";
import { Loader2 } from "lucide-react";
import { useLocation, useNavigate } from "react-router"; 

type Props = {
  categorias: Categoria[];
  estados: Estado[];
  onFiltrar: (filtros: FiltroValues) => void;
  initialValues?: FiltroValues;
};

export type FiltroValues = {
  texto: string;
  categorias: string[];
  estados: string;
  ordenar: "recientes" | "antiguos" | "";
};

export const FiltroPublicaciones = ({ categorias, estados, onFiltrar, initialValues, }: Props) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting }
  } = useForm<FiltroValues>({
    defaultValues: initialValues || {
      texto: "",
      categorias: [],
      estados: "todos",
      ordenar: "recientes",
    },
  });
  const location = useLocation();
  const navigate = useNavigate();
  const defaults: FiltroValues = {
    texto: "",
    categorias: [],
    estados: "todos",
    ordenar: "recientes",
  };

  useEffect(() => {
  if (initialValues) {
    const initialFormValues = {
      ...defaults,
      ...initialValues,
      categorias: initialValues.categorias.map(String),
      estados: String(initialValues.estados),
    };
    console.log("Filtros restablecidos:", initialValues);
    reset(initialFormValues);
  }
  }, [initialValues, reset]);

  const onSubmit = (data: FiltroValues) => {
    console.log("Filtros buscados:", data);
    const filtro: FiltroValues = {
      texto: data.texto,
      categorias: data.categorias, 
      estados: data.estados,
      ordenar: data.ordenar,
    };
    
    const estaEnForo = location.pathname === "/foro";

    if (!estaEnForo) {
      const query = new URLSearchParams();
      if (filtro.texto) query.set("texto", filtro.texto);
      if (filtro.categorias.length > 0) {
        filtro.categorias.forEach((cat) => query.append("categorias", cat));
      }
      if (filtro.estados && filtro.estados !== "todos") {
        query.set("estados", filtro.estados);
      }
      if (filtro.ordenar) query.set("ordenar", filtro.ordenar);

      navigate(`/foro?${query.toString()}`);
    } else {
      onFiltrar(filtro);
    }

    onFiltrar(filtro);
  };

  const limpiarFiltros = () => {
    reset({
      ...defaults,
    });
    onFiltrar({
      ...defaults,
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="border border-gray-300 rounded-xl py-6 px-8 shadow-sm space-y-4 overflow-y-auto"
    >
      <h3 className="text-2xl font-bold text-black-1600">Filtrar publicaciones</h3>

      {/* Buscar */}
      <div>
        <label className="text-xl font-bold text-black-1600">Buscar</label>
        <input
          type="text"
          {...register("texto")}
          className="w-full border px-3 py-1 rounded-md"
          placeholder="Escribe una palabra..."
        />
      </div>

      {/* Categorías (checkboxes) */}
      <div>
        <p className="text-xl font-bold text-black-1600">Categorías</p>
        {categorias.map((cat) => (
          <div key={cat.id} className="flex items-center gap-2">
            <input
              type="checkbox"
              value={cat.id}
              {...register("categorias")}
              id={`cat-${cat.id}`}
            />
            <label htmlFor={`cat-${cat.id}`}>{cat.nombre}</label>
          </div>
        ))}
      </div>
      
      {/* Estado (radio) */}
      <div>
        <p className="font-semibold">Estado</p>
        <div className="flex flex-col gap-1">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              value="todos"
              {...register("estados")}
            />
            Todos
          </label>
          {estados.map((estado) => (
            <label key={estado.id} className="flex items-center gap-2">
              <input
                type="radio"
                value={estado.id}
                {...register("estados")}
              />
              {estado.tipo}
            </label>
          ))}
        </div>
      </div>

      {/* Ordenar por (radio) */}
      <div>
        <p className="text-xl font-bold text-black-1600">Ordenar por</p>
        <div className="flex flex-col gap-1">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              value="recientes"
              {...register("ordenar")}
            />
            Más recientes
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              value="antiguos"
              {...register("ordenar")}
            />
            Más antiguos
          </label>
        </div>
      </div>

      {/* Acciones */}
      <div className="flex justify-between">
        <button
          type="button"
          onClick={limpiarFiltros}
          className="text-sm text-gray-500 hover:underline"
        >
          Limpiar filtros
        </button>
        <Button type="submit" size="btnForo" disabled={isSubmitting}>
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <Loader2 className="animate-spin size-4" />
              Filtrando...
            </span>
          ) : (
            "Filtrar"
          )}
        </Button>
      </div>
    </form>
  );
}