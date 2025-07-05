export function formatoFechaRelativa(fechaISO: string): string {
  const fecha = new Date(fechaISO);

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