import { ContaDTO } from "@/interface/conta/ContaDTO";
import { ContaTreeNodeDTO } from "@/interface/conta/ContaTreeNodeDTO";
import ServiceBase from "@/services/base/ServiceBase";
import { AxiosResponse } from "axios";

class ContaService extends ServiceBase {
  private path: string = "/contas";

  async listarTree(): Promise<AxiosResponse<ContaTreeNodeDTO[]>> {
    return this.$axios.get<void, AxiosResponse<ContaTreeNodeDTO[]>>(
      `${this.path}/tree`
    );
  }

  async criar(conta: ContaDTO): Promise<ContaDTO> {
    return this.$axios.post<ContaDTO, ContaDTO>(`${this.path}`, conta, {});
  }

  async alterar(conta: ContaDTO): Promise<ContaDTO> {
    return this.$axios.put<ContaDTO, ContaDTO>(
      `${this.path}/${conta.id}`,
      conta
    );
  }

  async associarNatureza(request: {
    contas: number[];
    naturezaId: number | null | undefined;
  }): Promise<ContaDTO> {
    return this.$axios.put<ContaDTO, ContaDTO>(
      `${this.path}/associar_natureza`,
      request
    );
  }

  async excluir(id: number): Promise<AxiosResponse<void>> {
    return this.$axios.delete<void>(`${this.path}/${id}`, {});
  }
}

export default new ContaService();
