<template>
  <modal
    :modalAberta="modalAberta"
    :titulo="tituloModal"
    @cancelar="cancelar"
    @salvar="salvar"
  >
    <template #body>
      <div class="container-dados-analise-financeira-modal">
        <div
          v-for="(fato, index) in dadosAnalise"
          :key="index"
          class="fato-container"
        >
          <b>{{ fato.fato }}</b>

          <!-- Controle de causas -->

          <panel-toggleable
            class="mt-4"
            :aberto="expandirCausas[index]"
            @toggle="toggleCausas(index)"
          >
            <template #header> Causas </template>

            <template #content>
              <div v-for="(causa, i) in fato.causas" :key="i">
                - {{ causa }}
              </div>
            </template>
          </panel-toggleable>

          <panel-toggleable
            class="mt-4"
            :aberto="expandirAcoes[index]"
            @toggle="toggleAcoes(index)"
          >
            <template #header> Ações </template>

            <template #content>
              <div v-for="(acao, i) in fato.acoes" :key="i">- {{ acao }}</div>
            </template>
          </panel-toggleable>
        </div>
      </div>
    </template>
  </modal>
</template>

<script lang="ts">
import Modal from "@/components/modal/Modal.vue";
import PanelToggleable from "@/components/panel-toggleable/PanelToggleable.vue";
import { Component, Prop, Vue, Watch } from "vue-facing-decorator";

@Component({
  components: { Modal, PanelToggleable },
  emits: ["modalAberta"],
})
export default class AnaliseFinanceiraModal extends Vue {
  @Prop({ type: Boolean, default: false })
  public modalAberta!: boolean;

  @Prop({ type: Array, default: () => [] })
  public dadosAnalise!: Array<{
    fato: string;
    causas: string[];
    acoes: string[];
  }>;

  // public dadosAnalise = [
  //   {
  //     acoes: [
  //       "Diversificação de produtos ou serviços para reduzir a sazonalidade.",
  //       "Desenvolvimento de estratégias de marketing e vendas contínuas durante todo o ano.",
  //       "Investigação das causas da falta de vendas nos outros meses, com foco em melhorias no processo comercial e prospecção de clientes.",
  //     ],
  //     causas: [
  //       "Modelo de negócio sazonal.",
  //       "Dependência de um único evento ou projeto em setembro.",
  //       "Problemas de vendas e marketing nos meses anteriores.",
  //     ],
  //     fato: "Receita de vendas concentrada em setembro de 2025 (R$ 6.000,00), com zero receita nos demais meses.",
  //   },
  //   {
  //     acoes: [
  //       "Melhoria no planejamento e controle de custos variáveis.",
  //       "Monitoramento mais preciso dos gastos em cada projeto ou atividade.",
  //       "Análise da eficiência operacional para reduzir custos desnecessários.",
  //     ],
  //     causas: [
  //       "Custos associados a projetos específicos.",
  //       "Problemas de planejamento e controle de custos.",
  //       "Atrasos ou urgências em produção ou serviços.",
  //     ],
  //     fato: "Custos variáveis presentes apenas em maio e julho de 2025, totalizando R$ 3.600,00.",
  //   },
  //   {
  //     acoes: [
  //       "Avaliação do plano de negócios e identificação de gargalos operacionais.",
  //       "Análise da necessidade de capital de giro e busca por fontes de financiamento, se necessário.",
  //       "Revisão do cronograma de atividades para garantir o lançamento do produto ou serviço em tempo hábil.",
  //     ],
  //     causas: [
  //       "Atraso no lançamento do produto ou serviço.",
  //       "Problemas de logística ou distribuição.",
  //       "Falta de capital de giro para operação.",
  //     ],
  //     fato: "Ausência de receita e custos variáveis em grande parte do ano.",
  //   },
  // ];

  public expandirCausas: boolean[] = [];
  public expandirAcoes: boolean[] = [];

  @Watch("modalAberta")
  public onModalAbertaChange(newValue: boolean) {
    if (newValue) {
      this.inicializar();
    }
  }

  public get tituloModal() {
    return "Análise Financeira";
  }

  private inicializar() {
    this.expandirCausas = this.dadosAnalise.map(() => false);
    this.expandirAcoes = this.dadosAnalise.map(() => false);
  }

  public toggleCausas(index: number) {
    this.expandirCausas[index] = !this.expandirCausas[index];
  }

  public toggleAcoes(index: number) {
    this.expandirAcoes[index] = !this.expandirAcoes[index];
  }

  public async salvar() {}
  public async cancelar() {
    this.fecharModal();
  }

  private fecharModal() {
    this.$emit("modalAberta", false);
  }
}
</script>

<style scoped>
.container-dados-analise-financeira-modal {
  height: 800px;
  overflow: auto;
}

.fato-container {
  margin-bottom: 1.5rem;
}

.lista-itens {
  margin-left: 1rem;
  margin-top: 0.25rem;
}

/* Transição suave */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}
.fade-enter-to,
.fade-leave-from {
  opacity: 1;
  transform: translateY(0);
}
</style>
