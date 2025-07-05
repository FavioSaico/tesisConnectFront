import { useForm, Controller } from "react-hook-form";
import { Categoria } from "@/types/Publicacion";
import { useSession } from "@/context/AuthContext";
import { crearPublicacion } from "../services/ForoApi";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

type Props = {
  categorias: Categoria[];
  onPublicar: () => void;
};

type FormInputs = {
  titulo: string;
  contenido: string;
  idCategoria: string;
};

export const FormNuevaPublicacion = ({ categorias, onPublicar }: Props) => {
  const { handleSubmit, reset, control, formState: { errors, isSubmitting } } = useForm<FormInputs>();
  const { user } = useSession();

  const onSubmit = async (data: FormInputs) => {
    if (!user?.usuario?.id) {
      console.warn("Sesión inválida");
      return;
    }

    try {
      await crearPublicacion({
        titulo: data.titulo,
        contenido: data.contenido,
        idCategoria: parseInt(data.idCategoria),
        idUsuario: parseInt(user.usuario.id),
      });

      reset({
        titulo: "",
        contenido: "",
        idCategoria: "",
      });
      onPublicar();
      toast.success("¡Publicación creada con éxito!", {
        style: {
          backgroundColor: "#D1FAE5",
          color: "#065F46",
        },
      });
    } catch (err) {
      console.error("Error al publicar", err);
      toast.error("Ocurrió un error al publicar. Intenta nuevamente.");
    }
  };

  if (!user) {
    return (
      <div className="border border-gray-300 rounded-xl py-4 px-8 shadow-sm text-center">
        <p className="text-sm text-gray-600">
          Inicia sesión para crear una publicación.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="border border-gray-300 rounded-xl py-6 px-8 shadow-sm space-y-2.5"
    >
      <h3 className="text-2xl font-bold text-black-1600">Nueva publicación</h3>
      <div>
        <Controller
          name="titulo"
          control={control}
          rules={{ required: "*el campo es obligatorio" }}
          render={({ field }) => (
            <>
              <Textarea
                placeholder="Título de la publicación"
                className="resize-y"
                {...field}
              />
              {errors.titulo && (
                <p className="text-red-500 text-sm mt-1">{errors.titulo.message}</p>
              )}
            </>
          )}
        />
      </div>
      <div>
        <Controller
          name="contenido"
          control={control}
          rules={{ required: "*el campo es obligatorio" }}
          render={({ field }) => (
            <>
              <Textarea
                placeholder="Escribe tu pregunta o comentario..."
                className="resize-y"
                {...field}
              />
              {errors.contenido && (
                <p className="text-red-500 text-sm mt-1">{errors.contenido.message}</p>
              )}
            </>
          )}
        />
      </div>
      <h3 className="text-xl font-bold text-black-1600">Categoría</h3>
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="w-full sm:max-w-xs">
          <Controller
            name="idCategoria"
            control={control}
            rules={{ required: "*el campo es obligatorio" }}
            render={({ field }) => (
              <>
                <Select
                  onValueChange={(value) => field.onChange(value)}
                  value={field.value ?? ""}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Escoge una categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {categorias.map((cat) => (
                      <SelectItem key={cat.id} value={String(cat.id)}>
                        {cat.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.idCategoria && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.idCategoria.message}
                  </p>
                )}
              </>
            )}
          />
        </div>

        <Button
          type="submit"
          size="btnForo"
          className="w-full sm:w-auto sm:ml-auto"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <Loader2 className="animate-spin size-4" />
              Publicando...
            </span>
          ) : (
            "Publicar"
          )}
        </Button>
      </div>
    </form>
  );
}