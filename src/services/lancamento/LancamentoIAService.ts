import { FatoCausaAcaoDTO } from "@/interface/fatocausaacao/FatoCausaAcaoDTO";
import { LancamentoGraficoDTO } from "@/interface/lancamento/LancamentoGraficoDTO";
import axios, { AxiosInstance } from "axios";

class LancamentoIAService {
  private path: string = "http://127.0.0.1:5000/";
  private axios: AxiosInstance;

  constructor(axiosInstance: AxiosInstance) {
    this.axios = axiosInstance;
  }

  async analiseFinanceira(
    dadosGrafico: LancamentoGraficoDTO
  ): Promise<FatoCausaAcaoDTO[]> {
    const response = await this.axios.post<FatoCausaAcaoDTO[]>(
      `${this.path}/analise-financeira`,
      dadosGrafico
    );
    return response.data;
  }
}

export default new LancamentoIAService(axios);
