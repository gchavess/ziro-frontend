<template>
  <div>
    <h1 class="titulo">Movimentação Financeira</h1>

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
    <table class="grid-movimentacao-financeira" :key="lancamentos.length">
      <thead class="bg-gray-100">
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
          <td>
            {{ lancamento.dataVencimento }}
          </td>
          <td>
            {{ lancamento.dataPagamento }}
          </td>
        </tr>
        <tr v-if="lancamentos.length === 0">
          <td colspan="6">Nenhum lançamento encontrado.</td>
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
table {
  border-collapse: collapse;
  width: 100%;
  background-color: var(--color-bg);
  color: var(--color-text);
  border-radius: 0.5rem;
}

thead th {
  background-color: var(--color-primary-light);
  color: var(--color-bg);
}

tbody tr:hover td {
  background-color: var(--color-primary-light);
  color: var(--color-bg);
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

.grid-movimentacao-financeira {
  margin-top: 2rem;
}

.titulo {
  color: var(--color-text);
}
</style>
