export interface ContaDTO {
  id: number | null;
  descricao?: string;
  observacao?: string;
  codigo?: string;
  paiId?: number | null;
  naturezaConta?: {
    id: number | null;
  };
}
