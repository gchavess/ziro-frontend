<template>
  <div>
    <h1 class="titulo-2">Movimentação Financeira</h1>

    <div class="botoes-acao">
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
    </div>

    <div class="tabela-wrapper">
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

    <lancamento-modal
      :modalAberta="modalAbertaLancamento"
      :acao="acaoBotao"
      :lancamentoSelecionado="lancamentoSelecionado"
      @recarregarGridLancamentos="preencherLancamentos"
      @modalAberta="modalAbertaLancamento = $event"
    />
  </div>
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
.botoes-acao {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.tabela-wrapper {
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  height: calc(100vh - 220px);
}

.grid-movimentacao-financeira {
  width: 100%;
  min-width: 700px;
  border-collapse: collapse;
}

.grid-movimentacao-financeira thead {
  background-color: var(--color-primary-light);
  color: var(--color-bg);
  position: sticky;
  top: 0;
  z-index: 1;
}

.grid-movimentacao-financeira th,
.grid-movimentacao-financeira td {
  padding: 0.75rem 1rem;
  text-align: left;
  border-bottom: 1px solid #e2e8f0;
}

.grid-movimentacao-financeira tbody tr:hover td {
  background-color: var(--color-primary-bg);
  color: #555 !important;
  cursor: pointer;
}

.selecionado {
  background-color: var(--color-primary-light);
  color: var(--color-bg);
}

@media (max-width: 768px) {
  .grid-movimentacao-financeira {
    min-width: 600px;
  }

  .tabela-wrapper {
    box-shadow: none;
    border-radius: 4px;
    height: calc(100vh - 260px);
  }
}
</style>
