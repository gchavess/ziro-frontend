export interface AnaliseFinanceiraDTO {
  id?: number | null;
  dataCriacao?: string;
  descricao?: string;
  observacao?: string;
  codigo?: string;
  fato?: string;
  causa?: string[] | string;
  acao?: string[] | string;
  editando?: boolean;
}
