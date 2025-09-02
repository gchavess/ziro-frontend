import { ContaDTO } from "@/interface//conta/ContaDTO";

export interface LancamentoDTO {
  id: number | null;
  descricao: string;
  observacao: string;
  dataVencimento: string;
  dataPagamento: string;
  valorBruto: number | null;
  conta: ContaDTO;
}
