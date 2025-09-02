import { LancamentoDTO } from "@/interface/lancamento/LancamentoDTO";
import ServiceBase from "@/services/base/ServiceBase";
import { AxiosResponse } from "axios";

class LancamentoService extends ServiceBase {
  private path: string = "/lancamentos";

  async listar(): Promise<AxiosResponse<LancamentoDTO[]>> {
    return this.$axios.get<void, AxiosResponse<LancamentoDTO[]>>(
      `${this.path}`
    );
  }

  async criar(lancamento: LancamentoDTO): Promise<LancamentoDTO> {
    return this.$axios.post<LancamentoDTO, LancamentoDTO>(
      `${this.path}`,
      lancamento
    );
  }

  async alterar(lancamento: LancamentoDTO): Promise<LancamentoDTO> {
    return this.$axios.put<LancamentoDTO, LancamentoDTO>(
      `${this.path}/${lancamento.id}`,
      lancamento
    );
  }

  async excluir(id: number): Promise<AxiosResponse<void>> {
    return this.$axios.delete<void>(`${this.path}/${id}`, {});
  }
}

export default new LancamentoService();
