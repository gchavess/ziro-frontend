<template>
  <div>
    <h1 class="titulo-2">Movimentação Financeira</h1>

    <button-icon
      @click="abrirModal(acaoButtonIcon.INCLUIR)"
      :acao="acaoButtonIcon.INCLUIR"
    />
    <button-icon
      @click="abrirModal(acaoButtonIcon.ALTERAR)"
      :acao="acaoButtonIcon.ALTERAR"
      :desabilitado="!lancamentoSelecionado"
    />
    <button-icon
      @click="abrirModal(acaoButtonIcon.EXCLUIR)"
      :acao="acaoButtonIcon.EXCLUIR"
      :desabilitado="!lancamentoSelecionado"
    />

    <!-- Tabela -->
    <table class="grid-movimentacao-financeira">
      <thead>
        <tr>
          <th>Descrição</th>
          <th>Valor</th>
          <th>Conta</th>
          <th>Data de Vencimento</th>
          <th>Data de Pagamento</th>
        </tr>
      </thead>
    </table>

    <div class="tbody-scroll">
      <table class="grid-movimentacao-financeira">
        <tbody>
          <tr
            v-for="(lancamento, index) in lancamentos"
            :key="index"
            :class="{ selecionado: lancamentoSelecionado === lancamento }"
            @click="selecionarLancamento(lancamento)"
          >
            <td>{{ lancamento.descricao }}</td>
            <td>{{ formatCurrencyBRL(lancamento.valorBruto) }}</td>
            <td v-if="lancamento.conta">{{ lancamento.conta.descricao }}</td>
            <td>{{ lancamento.dataVencimento }}</td>
            <td>{{ lancamento.dataPagamento }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <lancamento-modal
    :modalAberta="modalAbertaLancamento"
    :acao="acaoBotao"
    :lancamentoSelecionado="lancamentoSelecionado"
    @recarregarGridLancamentos="preencherLancamentos"
    @modalAberta="modalAbertaLancamento = $event"
  >
  </lancamento-modal>
</template>

<script lang="ts">
import ButtonIcon from "@/components/button-icon/ButtonIcon.vue";
import PrimaryButton from "@/components/button/PrimaryButton.vue";
import { AcaoButtonIcon } from "@/enums/AcaoButtonIcon";
import { ButtonColor } from "@/enums/ButtonColor";
import { LancamentoDTO } from "@/interface/lancamento/LancamentoDTO";
import LancamentoService from "@/services/lancamento/LancamentoService";
import { formatCurrencyBRL } from "@/utils/moeda/MoedaUtil";
import LancamentoModal from "@/views/movimentacaofinanceira/lancamento/LancamentoModal.vue";
import { Component, Vue } from "vue-facing-decorator";

@Component({
  components: {
    LancamentoModal,
    PrimaryButton,
    ButtonIcon,
  },
})
export default class MovimentacaoFinanceiraView extends Vue {
  public buttonColor = ButtonColor;
  public acaoButtonIcon = AcaoButtonIcon;

  public acaoBotao: AcaoButtonIcon | null = null;

  public lancamentos: LancamentoDTO[] = [];
  public lancamentoSelecionado: LancamentoDTO | null = null;
  public modalAbertaLancamento = false;
  public formatCurrencyBRL = formatCurrencyBRL;

  mounted() {
    this.incializar();
  }

  private incializar() {
    this.preencherLancamentos();
  }

  public async preencherLancamentos() {
    await LancamentoService.listar()
      .then((response) => {
        this.lancamentos = response.data;

        console.log("this.lancamentos", this.lancamentos);
      })
      .catch((error) => {
        console.error("Erro ao buscar lançamentos:", error);
      });
  }

  public abrirModal(acaoBotao: AcaoButtonIcon) {
    this.acaoBotao = acaoBotao;
    this.modalAbertaLancamento = true;
  }

  public fecharModal() {
    this.modalAbertaLancamento = false;
  }

  public selecionarLancamento(lancamento: LancamentoDTO) {
    this.lancamentoSelecionado = lancamento;
  }
}
</script>

<style scoped>
.grid-movimentacao-financeira {
  width: 100%;
  border-collapse: collapse;
  max-height: calc(100vh - 220px);
  display: block;
  overflow-y: auto;
}

.grid-movimentacao-financeira thead,
.grid-movimentacao-financeira tbody tr {
  display: table;
  width: 100%;
  table-layout: fixed;
}

.grid-movimentacao-financeira thead {
  position: sticky;
  top: 0;
  background-color: var(--color-primary-light);
  z-index: 1;
}

.grid-movimentacao-financeira thead th {
  background-color: var(--color-primary-light);
  color: var(--color-bg);
}

.grid-movimentacao-financeira tbody tr:hover td {
  background-color: var(--color-primary-bg);
  color: #555 !important;
  cursor: pointer;
}

/* Linha selecionada */
.selecionado {
  background-color: var(--color-primary-light);
  color: var(--color-bg);
}

td {
  vertical-align: middle;
}

.titulo {
  color: var(--color-text);
}
</style>
