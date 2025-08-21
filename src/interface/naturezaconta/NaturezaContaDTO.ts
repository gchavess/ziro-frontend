import { ContextoContaDTO } from "@/interface/contextoconta/ContextoContaDTO";

export interface NaturezaContaDTO {
  id: number | null;
  descricao: string;
  observacao: string;
  codigo: string;
  contextoConta: ContextoContaDTO;
}
