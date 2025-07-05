import { useForm, Controller } from "react-hook-form";
import { crearComentario } from "../services/ForoApi";
import { useSession } from "@/context/AuthContext";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import enviar_ico from "/enviar_ico.png";

type FormInputs = {
  contenido: string;
};

type Props = {
  idPublicacion: number;
  idComentarioPadre: string;
  onComentarioCreado: () => void;
};

export const FormRespuesta = ({
  idPublicacion,
  idComentarioPadre,
  onComentarioCreado,
}: Props) => {
  const { user } = useSession();
  const {
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormInputs>();

  const onSubmit = async (data: FormInputs) => {
    if (!user?.usuario?.id) {
      toast.error("Debes iniciar sesión para responder.");
      return;
    }

    try {
      await crearComentario(idPublicacion, {
        contenido: data.contenido,
        idUsuario: parseInt(user.usuario.id),
        idComentarioPadre,
      });
      toast.success("Respuesta publicada");
      reset();
      onComentarioCreado();
    } catch (err) {
      console.error(err);
      toast.error("No se pudo publicar la respuesta");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-3 space-y-2">
      <div className="flex flex-col sm:flex-row items-start sm:items-start gap-y-4">
        <div className="w-full">
        <Controller 
          name="contenido"
          control={control}
          rules={{ required: "*el campo es obligatorio" }}
          render={({ field }) => (
            <>
              <Textarea
                placeholder="Escribe tu respuesta..."
                className="w-full resize-none min-h-[38px] break-all bg-white"
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
          className="w-full sm:w-auto sm:ml-auto min-h-[38px] px-2.5 gap-0"
          disabled={isSubmitting}   
        >
          {isSubmitting ? (
            <span className="flex items-center">
              <Loader2 className="animate-spin size-4" />
              Subiendo...
            </span>
          ) : (
            <img
                src={enviar_ico}
                alt="icono_flecha"
                className="w-5 h-5"
            />
          )}
        </Button>
      </div>
    </form>
  );
};