import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Categoria, Estado } from "@/types/Publicacion";
import { Loader2 } from "lucide-react";

type Props = {
  categorias: Categoria[];
  estados: Estado[];
  onFiltrar: (filtros: FiltroValues) => void;
};

export type FiltroValues = {
  texto: string;
  categorias: number[];
  estados: number | "todos";
  ordenar: "recientes" | "antiguos" | "";
};

export const FiltroPublicaciones = ({ categorias, estados, onFiltrar }: Props) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting }
  } = useForm<FiltroValues>({
    defaultValues: {
      texto: "",
      categorias: [],
      estados: "todos",
      ordenar: "recientes",
    },
  });

  const onSubmit = (data: FiltroValues) => {
    console.log("Filtros aplicados:", data);
    const filtro: FiltroValues = {
      texto: data.texto,
      categorias: data.categorias.map(Number), 
      estados: data.estados,
      ordenar: data.ordenar,
    };

    if (data.estados !== "todos") {
      filtro.estados = Number(data.estados);
    }

    onFiltrar(filtro);
  };

  const limpiarFiltros = () => {
    reset({
      texto: "",
      categorias: [],
      estados: "todos",
      ordenar: "recientes",
    });
    onFiltrar({
      texto: "",
      categorias: [],
      estados: "todos",
      ordenar: "recientes",
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="border border-gray-300 rounded-xl py-6 px-8 shadow-sm space-y-4 overflow-y-auto"
    >
      <h3 className="text-2xl font-bold text-black-1600">Filtrar publicaciones</h3>

      <div>
        <label className="text-xl font-bold text-black-1600">Buscar</label>
        <input
          type="text"
          {...register("texto")}
          className="w-full border px-3 py-1 rounded-md"
          placeholder="Escribe una palabra..."
        />
      </div>

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

      <div className="flex justify-between">
        <button
          type="button"
          onClick={limpiarFiltros}
          className="text-sm text-gray-500 underline"
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