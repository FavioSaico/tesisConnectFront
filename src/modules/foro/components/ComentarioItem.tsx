import { Comentario } from "@/types/Comentario";
import { formatoFechaRelativa } from "@/lib/fecha";
import { useState } from "react";
import { FormRespuesta } from "./FormRespuesta";
import { useSession } from "@/context/AuthContext";
import { marcarComentario, desmarcarComentario } from "../services/ForoApi";
import flecha_abajo_ico from "/flecha_abajo_ico.png";
import flecha_arriba_ico from "/flecha_arriba_ico.png";
import marcado_ico from "/marcado_ico.png";
import marcar_ico from "/marcar_ico.png";
import desmarcar_ico from "/desmarcar_ico.png";

type Props = {
  comentario: Comentario;
  usuarios: Map<number, string>;
  nivel: number;
  onComentarioCreado: () => void;
  esRespuestaOficial?: boolean;
  idUsuarioPublicacion: number;
  yaHayRespuestaMarcada: Boolean;
};

export const ComentarioItem = ({ comentario, usuarios, nivel, onComentarioCreado, esRespuestaOficial, idUsuarioPublicacion, yaHayRespuestaMarcada}: Props) => {
  const [mostrarRespuestas, setMostrarRespuestas] = useState(false);
  const {idComentario, idPublicacion, idUsuario, contenido, fechaCreacion, respuestas } = comentario;
  const [respondiendo, setRespondiendo] = useState(false);
  const { user } = useSession();
  const esAutorPublicacion = user?.usuario?.id !== undefined && parseInt(user.usuario.id) === idUsuarioPublicacion;

  return (
    <div
  className={`relative border rounded-xl px-8 py-4 shadow-sm ${
    esRespuestaOficial
      ? "bg-blue-50 border-blue-300"
      : "border-gray-300"
  }`}
>
      {/* Cabecera */}
      <div className="flex justify-between text-base text-gray-600">
        <p className="font-bold">
          {idUsuario === idUsuarioPublicacion && (
            <span className="text-blue-400 mr-1">(Autor)</span>
          )}
          <span className="text-blue-800">{usuarios.get(idUsuario) ?? "Usuario desconocido"}</span>
        </p>
        {/* Comentario Marcado para publico en general*/}
        {!esAutorPublicacion && esRespuestaOficial && (
          <div className="absolute top-4 right-8">
            <img
                src= {marcado_ico}
                alt="icono_marcado"
                className="w-7 h-7"
              />
          </div>
        )}
        {/* Marcar y desmarcar comentario para autor*/}
        {esAutorPublicacion && (
          esRespuestaOficial || !yaHayRespuestaMarcada ? (
            <button
              className="text-xs text-blue-600 underline ml-2"
              onClick={async () => {
                try {
                  if (esRespuestaOficial) {
                    await desmarcarComentario(idPublicacion);
                  } else {
                    await marcarComentario(idPublicacion, idComentario);
                  }
                  onComentarioCreado();
                } catch (err) {
                  console.error("Error al marcar/desmarcar comentario como respuesta", err);
                }
              }}
            >
              <img
                  src={esRespuestaOficial ? desmarcar_ico : marcar_ico}
                  alt="icono_flecha"
                  className="w-7 h-7"
                />
            </button>
          ) : null
        )}
      </div>

      {/* Contenido */}
      <p className="mt-2 text-gray-800 text-[1rem]">{contenido}</p>

      {/* Footer */}
      <div className="mt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm text-gray-500 gap-2">
        <div className="flex flex-wrap items-center w-full">
          <span>{formatoFechaRelativa(fechaCreacion)}</span>
          {user && nivel < 1 && (
            <button 
              className="hover:underline text-sm ml-auto sm:ml-8"
              onClick={() => setRespondiendo((prev) => !prev)}
            >
              {respondiendo ? "← Cancelar" : "→ Responder"}
            </button>
          )}
        </div>
        <div className="flex justify-end gap-4 items-center min-w-fit">
          {respuestas.length > 0 && (
            <button
              className="hover:underline text-sm flex items-center gap-2"
              onClick={() => setMostrarRespuestas((prev) => !prev)}
            >
              {mostrarRespuestas ? "Ocultar" : `Ver ${respuestas.length} respuesta(s)`}
              <img
                src={mostrarRespuestas ? flecha_arriba_ico : flecha_abajo_ico}
                alt="icono_flecha"
                className="w-3 h-3"
              />
            </button>
          )}
        </div>
      </div>
      {/* Formulario de respuesta */}
      {respondiendo && (
        <div className="mt-4 pl-4 border-l-2 border-gray-200 space-y-2">
        <FormRespuesta
          idPublicacion={idPublicacion}
          idComentarioPadre={idComentario}
          onComentarioCreado={() => {
            setRespondiendo(false);
            onComentarioCreado();
          }}
        />
        </div>
      )}
      {/* Respuestas */}
      {mostrarRespuestas && respuestas.length > 0 && (
        <div className="mt-4 pl-4 border-l-2 border-gray-200 space-y-2">
          {respuestas.map((resp) => (
            <ComentarioItem key={resp.idComentario} comentario={resp} usuarios={usuarios} nivel={nivel + 1} onComentarioCreado={onComentarioCreado} idUsuarioPublicacion={idUsuarioPublicacion} yaHayRespuestaMarcada={yaHayRespuestaMarcada}/>
          ))}
        </div>
      )}
    </div>
  );
};