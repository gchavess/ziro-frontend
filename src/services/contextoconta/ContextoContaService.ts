import { ContextoContaDTO } from "@/interface/contextoconta/ContextoContaDTO";
import ServiceBase from "@/services/base/ServiceBase";
import { AxiosResponse } from "axios";

class ContextoContaService extends ServiceBase {
  private path: string = "/contextos_conta";

  async criar(contextoConta: ContextoContaDTO): Promise<ContextoContaDTO> {
    return this.$axios.post<ContextoContaDTO, ContextoContaDTO>(
      `${this.path}`,
      contextoConta
    );
  }

  async alterar(contextoConta: ContextoContaDTO): Promise<ContextoContaDTO> {
    return this.$axios.put<ContextoContaDTO, ContextoContaDTO>(
      `${this.path}/${contextoConta.id}`,
      contextoConta
    );
  }

  async excluir(id: number): Promise<AxiosResponse<void>> {
    return this.$axios.delete<void>(`${this.path}/${id}`, {});
  }
}

export default new ContextoContaService();
