import { AnaliseFinanceiraDTO } from "@/interface/analisefinanceira/AnaliseFinanceiraDTO";
import { LancamentoGraficoDTO } from "@/interface/lancamento/LancamentoGraficoDTO";
import ServiceBase from "@/services/base/ServiceBase";
import { AxiosResponse } from "axios";

class AnaliseFinanceiraService extends ServiceBase {
  private path: string = "/analises_financeiras";

  async listarTodos(): Promise<AxiosResponse<AnaliseFinanceiraDTO[]>> {
    return this.$axios.get<void, AxiosResponse<AnaliseFinanceiraDTO[]>>(
      `${this.path}`
    );
  }

  async criar(
    contextoConta: AnaliseFinanceiraDTO
  ): Promise<AxiosResponse<AnaliseFinanceiraDTO>> {
    return this.$axios.post<AnaliseFinanceiraDTO>(
      `${this.path}`,
      contextoConta
    );
  }

  async alterar(
    contextoConta: AnaliseFinanceiraDTO
  ): Promise<AnaliseFinanceiraDTO> {
    return this.$axios.put<AnaliseFinanceiraDTO, AnaliseFinanceiraDTO>(
      `${this.path}/${contextoConta.id}`,
      contextoConta
    );
  }

  async excluir(id: number): Promise<AxiosResponse<void>> {
    return this.$axios.delete<void>(`${this.path}/${id}`, {});
  }

  async gerarInsights(
    dadosGrafico: LancamentoGraficoDTO
  ): Promise<AxiosResponse<AnaliseFinanceiraDTO>> {
    return this.$axios.post<AnaliseFinanceiraDTO>(
      `${this.path}/insights`,
      dadosGrafico
    );
  }
}

export default new AnaliseFinanceiraService();
