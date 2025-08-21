import { NaturezaContaAgrupadaDTO } from "@/interface/naturezaconta/NaturezaContaAgrupadaDTO";
import { NaturezaContaDTO } from "@/interface/naturezaconta/NaturezaContaDTO";
import ServiceBase from "@/services/base/ServiceBase";
import { authState } from "@/store/auth";
import { AxiosResponse } from "axios";

class NaturezaContaService extends ServiceBase {
  private path: string = "/naturezas_conta";

  async listarAgrupadasPorContexto(): Promise<
    AxiosResponse<NaturezaContaAgrupadaDTO[]>
  > {
    return this.$axios.get<void, AxiosResponse<NaturezaContaAgrupadaDTO[]>>(
      `${this.path}/agrupadas`
    );
  }

  async criar(naturezaConta: NaturezaContaDTO): Promise<NaturezaContaDTO> {
    return this.$axios.post<NaturezaContaDTO, NaturezaContaDTO>(
      `${this.path}`,
      naturezaConta,
      {
        headers: {
          "XXX-USUARIO-ID": authState.usuarioLogadoId,
        },
      }
    );
  }

  async alterar(naturezaConta: NaturezaContaDTO): Promise<NaturezaContaDTO> {
    return this.$axios.put<NaturezaContaDTO, NaturezaContaDTO>(
      `${this.path}/${naturezaConta.id}`,
      naturezaConta,
      {
        headers: {
          "XXX-USUARIO-ID": authState.usuarioLogadoId,
        },
      }
    );
  }

  async excluir(id: number): Promise<AxiosResponse<void>> {
    return this.$axios.delete<void>(`${this.path}/${id}`, {
      headers: {
        "XXX-USUARIO-ID": authState.usuarioLogadoId,
      },
    });
  }
}

export default new NaturezaContaService();
