import { useForm, Controller } from "react-hook-form";
import { useSession } from "@/context/AuthContext";
import { crearComentario } from "../services/ForoApi";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

type Props = {
  idPublicacion: number;
  onComentarioCreado: () => void;
  idComentarioPadre?: string;
};

type FormInputs = {
  contenido: string;
};

export const FormNuevoComentario = ({ idPublicacion, idComentarioPadre, onComentarioCreado }: Props) => {
  const { user } = useSession();
  const { handleSubmit, reset, control, formState: { errors, isSubmitting} } = useForm<FormInputs>();

  const onSubmit = async (data: FormInputs) => {
    if (!user?.usuario?.id) {
      toast.error("Debes iniciar sesión para comentar.");
      return;
    }

    try {
      await crearComentario(idPublicacion, {
        contenido: data.contenido,
        idUsuario: parseInt(user.usuario.id),
        idComentarioPadre: idComentarioPadre ?? null
      });
      toast.success("Comentario publicado");
      reset();
      onComentarioCreado();
    } catch (err) {
      console.error(err);
      toast.error("No se pudo publicar el comentario");
    }
  };

  if (!user) {
    return (
      <div className="border border-gray-300 rounded-xl py-4 px-8 shadow-sm text-center">
        <p className="text-sm text-gray-600">
          Inicia sesión para comentar en la publicación.
        </p>
      </div>
    );
  }

  return (
    <form 
      onSubmit={handleSubmit(onSubmit)} 
      className="border border-gray-300 rounded-xl py-6 px-8 shadow-sm space-y-2.5"
    >
      <h3 className="text-[20px] font-bold text-black-1600">Añadir comentario</h3>
      <div className="flex flex-col sm:flex-row items-start sm:items-start gap-x-8 gap-y-4">
        <div className="w-full">
        <Controller
          name="contenido"
          control={control}
          rules={{ required: "* El campo es obligatorio" }}
          render={({ field }) => (
            <>
              <Textarea
                placeholder="Escribe tu comentario..."
                className="w-full resize-none min-h-[38px] break-all"
                {...field}
              />
              {errors.contenido && (
                <p className="text-red-500 text-sm mt-1">{errors.contenido.message}</p>
              )}
            </>
          )}
        />
        </div>
        <Button
          type="submit"
          size="btnForo"
          className="w-full sm:w-auto sm:ml-auto min-h-[38px]"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <Loader2 className="animate-spin size-4" />
              Subiendo...
            </span>
          ) : (
            "Comentar"
          )}
        </Button>
      </div>
    </form>
  );
};