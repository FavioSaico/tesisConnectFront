import { Publicacion } from "@/types/Publicacion";
import { Link } from "react-router";
import { formatoFechaRelativa } from "@/lib/fecha";

type Props = {
  publicacion: Publicacion;
  nombreAutor?: string;
};

export const PublicacionCard = ({ publicacion, nombreAutor }: Props) => {
  const {
    idPublicacion,
    titulo,
    contenido,
    idEstado,
    fechaCreacion,
  } = publicacion;

  const fechaTexto = formatoFechaRelativa(fechaCreacion);

  return (
    <Link
      to={`/foro/publicacion/${idPublicacion}`}
      className="block border border-gray-300 rounded-xl py-4 px-8 hover:bg-gray-50 transition-all shadow-sm space-y-2"
    >
      {idEstado === 2 && (
        <div className="inline-block bg-green-100 text-green-700 text-sm font-semibold px-2 rounded-lg">
          ✓ Solucionado
        </div>
      )}

      <h2 className="text-xl font-bold text-black-1600">{titulo}</h2>

      <p className="text-[0.875rem] text-black-600 line-clamp-2">{contenido}</p>

      <div className="flex justify-between items-center mt-3 font-medium">
        <span className="text-base text-blue-500">
            {nombreAutor || `Usuario desconocido`}
        </span>
        <span className="text-sm text-gray-500">
            {fechaTexto}
        </span>
    </div>
    </Link>
  );
}