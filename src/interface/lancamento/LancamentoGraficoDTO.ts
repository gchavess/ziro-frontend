export interface LancamentoGraficoDTO {
  months: string[];
  datasets: { label: string; data: number[]; backgroundColor: string };
}
