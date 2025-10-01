export function formatarData(data: string | number | null | undefined): string {
  if (!data) return "";

  let date: Date;

  if (typeof data === "number") {
    date = new Date(data);
  } else {
    date = new Date(data);
  }

  if (isNaN(date.getTime())) return "";

  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}
