<template>
  <modal
    :modalAberta="modalAberta"
    :tamanho="'grande'"
    :exibirBoaoSalvar="false"
    titulo="Exemplo de Arquivo CSV"
    @cancelar="fecharModal"
  >
    <template #body>
      <div class="exemplo-csv">
        <span class="titulo-5">Formato esperado:</span>
        <ul class="pt-2">
          <li>Arquivo <b>.csv</b> (UTF-8)</li>
          <li>Separador: <b>;</b></li>
          <li>Com cabeçalho na primeira linha</li>
        </ul>

        <div class="pt-4">
          <span class="titulo-6">Exemplo em tabela:</span>
          <table class="tabela-exemplo">
            <thead>
              <tr>
                <th>tipo</th>
                <th>descricao</th>
                <th>observacao</th>
                <th>codigo</th>
                <th>dataVencimento</th>
                <th>dataPagamento</th>
                <th>valorBruto</th>
                <th>paiOuContaCodigo</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>CONTA</td>
                <td>Receitas</td>
                <td>Receitas operacionais da empresa</td>
                <td>COD100</td>
                <td></td>
                <td></td>
                <td>0</td>
                <td></td>
              </tr>
              <tr>
                <td>CONTA</td>
                <td>Serviços</td>
                <td>Receita de serviços prestados</td>
                <td>COD101</td>
                <td></td>
                <td></td>
                <td>0</td>
                <td>COD100</td>
              </tr>
              <tr>
                <td>LANCAMENTO</td>
                <td>Receita Serviços - 01/2025</td>
                <td>Receita de serviços prestados</td>
                <td>COD101</td>
                <td>2025-01-31</td>
                <td>2025-01-30</td>
                <td>1500000.00</td>
                <td>COD101</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="pt-4">
          <a
            href="/importacao-dados/exemplo-importacao-dados-planilha.csv"
            download="exemplo-importacao-dados-planilha.csv"
            class="botao-link"
          >
            📥 Baixar modelo.csv
          </a>
        </div>
      </div>
    </template>
  </modal>
</template>

<script lang="ts">
import Modal from "@/components/modal/Modal.vue";
import { Component, Prop, Vue } from "vue-facing-decorator";

@Component({
  components: { Modal },
  emits: ["modalAberta"],
})
export default class InformacaoCsvModal extends Vue {
  @Prop({ type: Boolean, default: false })
  public modalAberta!: boolean;

  public async cancelar() {
    this.fecharModal();
  }

  private fecharModal() {
    this.$emit("modalAberta", false);
  }
}
</script>

<style scoped>
.tabela-exemplo {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.tabela-exemplo th,
.tabela-exemplo td {
  border: 1px solid #ccc;
  padding: 6px 8px;
  text-align: left;
}
</style>
