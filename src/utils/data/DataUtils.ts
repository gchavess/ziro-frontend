export function formatarData(data: string | number | null | undefined): string {
  if (!data) return "";

  let date: Date;

  if (typeof data === "number") {
    date = new Date(data);
  } else {
    const [year, month, day] = data.split("-").map(Number);
    date = new Date(year, month - 1, day);
  }

  return date.toLocaleDateString("pt-BR");
}
