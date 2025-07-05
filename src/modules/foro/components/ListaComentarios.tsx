import { Comentario } from "@/types/Comentario";
import { ComentarioItem } from "./ComentarioItem";

type Props = {
  comentarios: Comentario[];
  total: number;
  usuarios: Map<number, string>;
  idRespuestaOficial: string | null;
  onComentarioCreado: () => void;
  idUsuarioPublicacion: number;
};

export const ListaComentarios = ({ comentarios, total, usuarios, idRespuestaOficial, onComentarioCreado, idUsuarioPublicacion }: Props) => {
  const destacado = comentarios.find(c => c.idComentario === idRespuestaOficial);
  const resto = comentarios.filter(c => c.idComentario !== idRespuestaOficial);
  return (
    <div className="space-y-4">
      <p className="text-gray-700 font-semibold">
        {total} comentario{total !== 1 ? "s" : ""}
      </p>

      {/* Comentario destacado */}
      {destacado && (
        <ComentarioItem
          key={destacado.idComentario}
          comentario={destacado}
          usuarios={usuarios}
          nivel={0}
          onComentarioCreado={onComentarioCreado}
          esRespuestaOficial={true}
          idUsuarioPublicacion={idUsuarioPublicacion}
          yaHayRespuestaMarcada={Boolean(idRespuestaOficial)}
        />
      )}

      {/* Resto de comentarios */}
      {resto.map((comentario) => (
        <ComentarioItem
          key={comentario.idComentario}
          comentario={comentario}
          usuarios={usuarios}
          nivel={0}
          onComentarioCreado={onComentarioCreado}
          idUsuarioPublicacion={idUsuarioPublicacion}
          yaHayRespuestaMarcada={Boolean(idRespuestaOficial)}
        />
      ))}
    </div>
  );
};