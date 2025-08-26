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
    <table class="grid-movimentacao-financeira">
      <thead class="bg-gray-100">
        <tr>
          <th>Data</th>
          <th>Descrição</th>
          <th>Categoria</th>
          <th>Tipo</th>
          <th>Valor</th>
          <th>Conta</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(lancamento, index) in lancamentos"
          :key="index"
          :class="{ selecionado: lancamentoSelecionado === lancamento }"
          @click="selecionarLancamento(lancamento)"
        >
          <td>{{ lancamento.data }}</td>
          <td>{{ lancamento.descricao }}</td>
          <td>{{ lancamento.categoria }}</td>
          <td>
            <span>{{ lancamento.tipo }}</span>
          </td>
          <td>R$ {{ lancamento.valor.toFixed(2) }}</td>
          <td>{{ lancamento.conta }}</td>
        </tr>
        <tr v-if="lancamentos.length === 0">
          <td colspan="6">Nenhum lançamento encontrado.</td>
        </tr>
      </tbody>
    </table>
  </div>

  <lancamento-modal
    :modalAbertaLancamento="modalAbertaLancamento"
    :acao="acaoBotao"
    @modalAbertaLancamento="modalAbertaLancamento = $event"
  >
  </lancamento-modal>
</template>

<script lang="ts">
import ButtonIcon from "@/components/button-icon/ButtonIcon.vue";
import PrimaryButton from "@/components/button/PrimaryButton.vue";
import { AcaoButtonIcon } from "@/enums/AcaoButtonIcon";
import { ButtonColor } from "@/enums/ButtonColor";
import LancamentoModal from "@/views/movimentacaofinanceira/lancamento/LancamentoModal.vue";
import { Component, Vue } from "vue-facing-decorator";

interface Lancamento {
  data: string;
  descricao: string;
  categoria: string;
  tipo: "Receita" | "Despesa" | "";
  valor: number;
  conta: string;
}

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

  public lancamentos: Lancamento[] = [
    {
      data: "2025-07-30",
      descricao: "Venda Produto X",
      categoria: "Vendas",
      tipo: "Receita",
      valor: 1500.0,
      conta: "Conta Corrente Itaú",
    },
    {
      data: "2025-07-29",
      descricao: "Pagamento de Fornecedor Y",
      categoria: "Fornecedores",
      tipo: "Despesa",
      valor: 850.75,
      conta: "Conta Corrente Bradesco",
    },
  ];

  public lancamentoSelecionado: Lancamento | null = null;

  public modalAbertaLancamento = false;

  public novoLancamento: Lancamento = {
    data: "",
    descricao: "",
    categoria: "",
    tipo: "",
    valor: 0,
    conta: "",
  };

  public abrirModal(acaoBotao: AcaoButtonIcon) {
    this.acaoBotao = acaoBotao;
    this.modalAbertaLancamento = true;
  }

  public fecharModal() {
    this.modalAbertaLancamento = false;
  }

  public salvarLancamento(lancamento: Lancamento) {
    this.lancamentos.push({ ...lancamento });
    this.fecharModal();
  }

  public selecionarLancamento(lancamento: Lancamento) {
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
