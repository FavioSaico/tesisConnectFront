import { Publicacion } from "@/types/Publicacion";
//import { Link } from "react-router";
import { formatoFechaRelativa } from "@/lib/fecha";

type Props = {
  publicacion: Publicacion;
  nombreAutor?: string;
};

export const DetallePublicacion = ({ publicacion, nombreAutor }: Props) => {
  const { 
    titulo, 
    contenido, 
    idEstado, 
    fechaCreacion 
  } = publicacion;
  const fecha = formatoFechaRelativa(fechaCreacion);

  return (
    <div className="space-y-3">
      {idEstado === 2 && (
        <div className="w-fit bg-green-100 text-green-800 text-sm font-semibold px-3 py-1 rounded-md">
          ✓ Solucionado
        </div>
      )}

      <h2 className="text-2xl font-bold text-blue-900">{titulo}</h2> 

      <div className="flex justify-between text-base text-gray-600">
        <p className="text-sky-700 font-bold">
            {nombreAutor ?? "Usuario desconocido"}
        </p>
        <span>{fecha}</span>
      </div>

      <p className="text-[1.1rem] text-gray-800">{contenido}</p>
    </div>
  );
};