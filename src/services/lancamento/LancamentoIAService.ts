import { AnaliseFinanceiraDTO } from "@/interface/analisefinanceira/AnaliseFinanceiraDTO";
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
  ): Promise<AnaliseFinanceiraDTO[]> {
    const response = await this.axios.post<AnaliseFinanceiraDTO[]>(
      `${this.path}/analise-financeira`,
      dadosGrafico
    );
    return response.data;
  }
}

export default new LancamentoIAService(axios);
