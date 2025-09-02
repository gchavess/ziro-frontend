export function formatCurrencyBRL(
  value: number | string | null | undefined
): string {
  if (value === null || value === undefined || isNaN(Number(value))) {
    return "R$ 0,00";
  }

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(value));
}
