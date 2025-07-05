import { Publicacion } from "@/types/Publicacion";
import { Link } from "react-router";

type Props = {
  publicacion: Publicacion;
  nombreAutor?: string;
};

function formatoFechaRelativa(fechaISO: string): string {
  const fecha = new Date(fechaISO);

  // 🔧 Ajuste si backend usa UTC sin "Z"
  const offsetMinutos = fecha.getTimezoneOffset();
  fecha.setMinutes(fecha.getMinutes() - offsetMinutos);

  const ahora = new Date();
  const diff = ahora.getTime() - fecha.getTime();

  const minutos = Math.floor(diff / (1000 * 60));
  const horas = Math.floor(diff / (1000 * 60 * 60));
  const dias = Math.floor(diff / (1000 * 60 * 60 * 24));
  const semanas = Math.floor(dias / 7);

  if (minutos < 1) return "justo ahora";
  if (minutos === 1) return "hace 1 minuto";
  if (minutos < 60) return `hace ${minutos} minutos`;
  if (horas === 1) return "hace 1 hora";
  if (horas < 24) return `hace ${horas} horas`;
  if (dias === 1) return "hace 1 día";
  if (dias < 21) return `hace ${dias} días`;
  if (semanas === 1) return "hace 1 semana";
  if (semanas <= 3) return `hace ${semanas} semanas`;

  return fecha.toLocaleDateString("es-PE", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export const PublicacionCard = ({ publicacion, nombreAutor }: Props) => {
  const {
    id,
    titulo,
    contenido,
    idEstado,
    fechaCreacion,
    idUsuario,
  } = publicacion;

  const fechaTexto = formatoFechaRelativa(fechaCreacion);

  return (
    <Link
      to={`/foro/${id}`}
      className="block border border-gray-300 rounded-xl py-4 px-8 hover:bg-gray-50 transition-all shadow-sm space-y-2"
    >
      {idEstado === 2 && (
        <div className="inline-block font-bold bg-green-100 text-green-700 text-sm font-semibold px-2 rounded-lg">
          ✓ Solucionado
        </div>
      )}

      <h2 className="text-2xl font-bold text-black-1600">{titulo}</h2>

      <p className="text-lg text-black-600 line-clamp-2">{contenido}</p>

      <div className="flex justify-between items-center mt-3 font-medium">
        <span className="text-base text-blue-500">
            {nombreAutor || `Usuario #${idUsuario}`}
        </span>
        <span className="text-sm text-gray-500">
            {fechaTexto}
        </span>
    </div>
    </Link>
  );
}