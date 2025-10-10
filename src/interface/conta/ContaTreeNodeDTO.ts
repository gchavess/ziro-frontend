export interface ContaTreeNodeDTO {
  id: number;
  descricao: string;
  expanded: boolean;
  naturezaContaId: number | null;
  codigo: string;
  observacao: string;
  children: ContaTreeNodeDTO[];
}
