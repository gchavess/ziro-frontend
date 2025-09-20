import { LancamentoDTO } from "@/interface/lancamento/LancamentoDTO";
import axios, { AxiosInstance } from "axios";

class LancamentoIAService {
  private path: string = "http://127.0.0.1:5000/";
  private axios: AxiosInstance;

  constructor(axiosInstance: AxiosInstance) {
    this.axios = axiosInstance;
  }

  async analiseFinanceira(dadosGrafico): Promise<LancamentoDTO> {
    const response = await this.axios.post<LancamentoDTO>(
      `${this.path}/analise-financeira`,
      dadosGrafico
    );
    return response.data;
  }
}

export default new LancamentoIAService(axios);
