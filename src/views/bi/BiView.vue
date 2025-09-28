<template>
  <div class="conteudo-modelagem-financeira-view">
    <h1 class="titulo-2">BI Financeiro</h1>

    <div class="flex gap-4" style="height: 95%">
      <div class="container-tree">
        <button-icon
          v-if="!treeModoAssociacao"
          :desabilitado="treeModoAssociacao"
          :acao="acaoButtonIcon.INCLUIR"
          @click="abrirModalConta(acaoButtonIcon.INCLUIR)"
        />
        <button-icon
          v-if="!treeModoAssociacao"
          :desabilitado="!itemTreeContaSelecionado || treeModoAssociacao"
          :acao="acaoButtonIcon.ALTERAR"
          @click="abrirModalConta(acaoButtonIcon.ALTERAR)"
        />
        <button-icon
          v-if="!treeModoAssociacao"
          :desabilitado="!itemTreeContaSelecionado || treeModoAssociacao"
          :acao="acaoButtonIcon.EXCLUIR"
          @click="abrirModalConta(acaoButtonIcon.EXCLUIR)"
        />
        <button-icon
          :acao="acaoButtonIcon.CONFIGURAR"
          @click="treeModoAssociacao = !treeModoAssociacao"
        />

        <tree-mult-select
          v-if="treeModoAssociacao"
          :treeData="dadosTreeConta"
          @itensSelecionados="alterouItensSelecionadosTreeAssociacao($event)"
        />

        <tree
          v-else
          :treeData="dadosTreeConta"
          @itemSelecionado="itemTreeContaSelecionado = $event"
        />
      </div>

      <div class="container-panel-menu-natureza-contexto">
        <button-icon
          @click="abrirModalContextoNatureza(acaoButtonIcon.INCLUIR)"
          :acao="acaoButtonIcon.INCLUIR"
        />
        <button-icon
          @click="abrirModalContextoNatureza(acaoButtonIcon.ALTERAR)"
          :acao="acaoButtonIcon.ALTERAR"
          :desabilitado="
            (!contextoContaSelecionado && !naturezaContaSelecionada) ||
            contextoContaSelecionado?.codigo === 'TODOS'
          "
        />
        <button-icon
          @click="abrirModalContextoNatureza(acaoButtonIcon.EXCLUIR)"
          :acao="acaoButtonIcon.EXCLUIR"
          :desabilitado="
            (!contextoContaSelecionado && !naturezaContaSelecionada) ||
            contextoContaSelecionado?.codigo === 'TODOS'
          "
        />
        <panel-menu
          :items="naturezasContaAgrupadas"
          @itemSelecionado="handleSelecionouContextoNatureza"
        />

        <div class="botoes-associar-natureza">
          <primary-button
            texto="Ignorar"
            :cor="buttonColor.SECUNDARIO"
            :desabilitado="true"
          />

          <primary-button
            class="ml-2"
            texto="Associar"
            :cor="buttonColor.PRIMARIO"
            :desabilitado="
              !naturezaContaSelecionada ||
              idsSelecionadosTreeAssociacao.length === 0
            "
            @click="associarNaturezas"
          />
        </div>
      </div>

      <div
        style="width: 100%"
        :style="`${
          tipoVisualizacaoGrafico === acaoButtonIcon.GRAFICO_PIZZA
            ? 'height: calc(100vh - 200px)'
            : 'height: calc(100vh - 200px)'
        }`"
      >
        <div style="display: flex">
          <group-button
            :acoes="[
              acaoButtonIcon.GRAFICO_LINHA,
              acaoButtonIcon.GRAFICO_BARRA,
              acaoButtonIcon.GRAFICO_PIZZA,
            ]"
            @onClick="alterouVisualizacaoGrafico($event)"
          />

          <input-text
            class="ml-2"
            v-model="filtro.dataInicio"
            :type="'date'"
            :label="'Data Início'"
            @change="preencherGrafico()"
          />

          <input-text
            class="ml-2"
            v-model="filtro.dataFim"
            :type="'date'"
            :label="'Data Início'"
            @change="preencherGrafico()"
          />

          <switch-button
            class="ml-2"
            label="Visão detalhada"
            v-model="visaoDetalhada"
            @change="preencherGrafico"
          />

          <div style="position: absolute; right: 2rem">
            <primary-button
              texto="Análise Financeira com IA"
              :cor="buttonColor.ALERTA"
              :carregando="carregandoAnaliseFinanceira"
              @click="gerarAnaliseFinanceira"
            />
          </div>
        </div>

        <chart-bar
          v-if="tipoVisualizacaoGrafico === acaoButtonIcon.GRAFICO_BARRA"
          :labels="dadosGrafico.months"
          :datasets="dadosGrafico.datasets"
          :groupByMonth="true"
          title="Lançamentos por conta"
        />

        <chart-line
          v-if="
            tipoVisualizacaoGrafico === acaoButtonIcon.GRAFICO_LINHA &&
            dadosGrafico &&
            dadosGrafico?.datasets?.length
          "
          :labels="dadosGrafico.months"
          :datasets="dadosGrafico.datasets"
          title="Lançamentos por conta"
        />

        <chart-pie
          v-if="tipoVisualizacaoGrafico === acaoButtonIcon.GRAFICO_PIZZA"
          :labels="dadosGrafico.months"
          :datasets="dadosGrafico.datasets"
          :periodo="periodoFormatado"
          title="Lançamentos por conta"
        />
      </div>
    </div>
  </div>

  <contexto-natureza-modal
    :modalAberta="modalAbertaContextoNatureza"
    :acao="acaoBotaoModalContextoNatureza"
    :naturezaContaSelecionada="naturezaContaSelecionada"
    :contextoContaSelecionado="contextoContaSelecionado"
    @recarregarPanelMenuContextoNatureza="preencherListaNaturezasContaAgrupada"
    @modalAberta="modalAbertaContextoNatureza = $event"
  ></contexto-natureza-modal>

  <conta-modal
    :modalAberta="modalAbertaConta"
    :acao="acaoBotaoModalConta"
    :itemTreeContaSelecionado="itemTreeContaSelecionado"
    @modalAberta="modalAbertaConta = $event"
    @recarregarTreeContas="preencherTreeContas"
  ></conta-modal>

  <analise-financeira-modal
    :dadosAnalise="dadosAnaliseFinanceira"
    :modalAberta="modalAbertaAnaliseFinanceira"
    @modalAberta="modalAbertaAnaliseFinanceira = $event"
  ></analise-financeira-modal>
</template>

<script lang="ts">
import ButtonIcon from "@/components/button-icon/ButtonIcon.vue";
import PrimaryButton from "@/components/button/PrimaryButton.vue";
import ChartBar from "@/components/chart-bar/ChartBar.vue";
import ChartLine from "@/components/chart-line/ChartLine.vue";
import ChartPie from "@/components/chart-pie/ChartPie.vue";
import { default as Chip } from "@/components/chip/Chip.vue";
import GroupButton from "@/components/group-button/GroupButton.vue";
import InputText from "@/components/input-text/InputText.vue";
import PanelMenu from "@/components/panel-menu/PanelMenu.vue";
import SwitchButton from "@/components/switch-button/SwitchButton.vue";
import TreeMultSelect from "@/components/tree-mult-select/TreeMultSelect.vue";
import Tree from "@/components/tree/Tree.vue";
import { AcaoButtonIcon } from "@/enums/AcaoButtonIcon";
import { ButtonColor } from "@/enums/ButtonColor";
import { ContaTreeNodeDTO } from "@/interface/conta/ContaTreeNodeDTO";
import { ContextoContaDTO } from "@/interface/contextoconta/ContextoContaDTO";
import { FatoCausaAcaoDTO } from "@/interface/fatocausaacao/FatoCausaAcaoDTO";
import { NaturezaContaAgrupadaDTO } from "@/interface/naturezaconta/NaturezaContaAgrupadaDTO";
import { NaturezaContaDTO } from "@/interface/naturezaconta/NaturezaContaDTO";
import ContaService from "@/services/conta/ContaService";
import LancamentoIAService from "@/services/lancamento/LancamentoIAService";
import LancamentoService from "@/services/lancamento/LancamentoService";
import NaturezaContaService from "@/services/naturezaconta/NaturezaContaService";
import { formatarData } from "@/utils/data/DataUtils";
import AnaliseFinanceiraModal from "@/views/bi/modal/AnaliseFinanceiraModal.vue";
import ContaModal from "@/views/bi/modal/ContaModal.vue";
import ContextoNaturezaModal from "@/views/bi/modal/ContextoNaturezaModal.vue";
import { Component, Vue } from "vue-facing-decorator";

@Component({
  components: {
    PanelMenu,
    ButtonIcon,
    ContextoNaturezaModal,
    TreeMultSelect,
    ContaModal,
    Tree,
    PrimaryButton,
    Chip,
    ChartBar,
    GroupButton,
    ChartLine,
    ChartPie,
    InputText,
    SwitchButton,
    AnaliseFinanceiraModal,
  },
})
export default class ModelagemFinanceiraView extends Vue {
  public acaoButtonIcon = AcaoButtonIcon;
  public buttonColor = ButtonColor;

  public modalAbertaContextoNatureza: boolean = false;
  public acaoBotaoModalContextoNatureza: AcaoButtonIcon | null = null;

  public modalAbertaConta: boolean = false;
  public acaoBotaoModalConta: AcaoButtonIcon | null = null;

  public naturezasContaAgrupadas: NaturezaContaAgrupadaDTO[] = [];

  public naturezaContaSelecionada: NaturezaContaDTO | null = null;
  public contextoContaSelecionado: ContextoContaDTO | null = null;

  public dadosTreeConta: ContaTreeNodeDTO[] = [];
  public itemTreeContaSelecionado: ContaTreeNodeDTO | null = null;
  public idsSelecionadosTreeAssociacao: number[] = [];

  public treeModoAssociacao: boolean = true;

  public visaoDetalhada: boolean = false;

  public tipoVisualizacaoGrafico: AcaoButtonIcon = AcaoButtonIcon.GRAFICO_BARRA;

  public dadosGrafico: any = {};
  public keyGrafico: number = 0;

  public carregandoAnaliseFinanceira: boolean = false;
  public modalAbertaAnaliseFinanceira = false;
  public dadosAnaliseFinanceira: FatoCausaAcaoDTO[] = [];
  // [
  //   {
  //     acoes: [
  //       "Desenvolvimento de um plano de vendas anual com metas mensais.",
  //       "Diversificação da base de clientes e fontes de receita.",
  //       "Investimento em marketing e vendas para gerar leads e receita ao longo do ano.",
  //       "Análise da sazonalidade e implementação de estratégias para mitigar o impacto dos meses de baixa receita.",
  //     ],
  //     causas: [
  //       "Falta de estratégia de vendas consistente ao longo do ano.",
  //       "Dependência excessiva de um único evento ou cliente em setembro.",
  //       "Problemas com o processo de vendas ou marketing.",
  //       "Sazonalidade extrema do negócio, sem planejamento para os meses de baixa.",
  //     ],
  //     fato: "Receita de vendas concentrada apenas em setembro de 2025 (R$ 6.000,00), com zero receita nos demais meses.",
  //   },
  //   {
  //     acoes: [
  //       "Implementação de um sistema de controle de custos mais rigoroso.",
  //       "Análise detalhada dos custos variáveis para identificar e eliminar gastos desnecessários.",
  //       "Melhoria dos processos de gestão de estoque e suprimentos.",
  //       "Otimização dos processos de produção ou operação para reduzir custos.",
  //     ],
  //     causas: [
  //       "Falta de controle de custos.",
  //       "Gastos imprevistos ou não planejados.",
  //       "Problemas com a gestão de estoque ou suprimentos.",
  //       "Processos ineficientes de produção ou operação.",
  //     ],
  //     fato: "Custos variáveis presentes apenas em maio e julho de 2025 (R$ 600,00 e R$ 3.000,00, respectivamente), sem relação aparente com a receita.",
  //   },
  //   {
  //     acoes: [
  //       "Melhorar o planejamento da produção e vendas, alinhando-as à demanda projetada.",
  //       "Revisão do processo de gestão de estoque para reduzir custos com itens obsoletos.",
  //       "Implementar um sistema de previsão de demanda mais preciso.",
  //     ],
  //     causas: [
  //       "Problemas de planejamento e sincronização entre produção e vendas.",
  //       "Estoque excessivo ou obsoleto gerando custos sem receita correspondente.",
  //       "Falta de previsão de demanda e consequente produção em excesso.",
  //     ],
  //     fato: "Descasamento entre receita e custos variáveis: custos significativos em meses sem receita.",
  //   },
  // ];

  public filtro: { dataInicio: string; dataFim: string } = {
    dataInicio: "2025-01-01",
    dataFim: "2025-12-31",
  };

  public get periodoFormatado(): string {
    return `${formatarData(this.filtro.dataInicio)} a ${formatarData(
      this.filtro.dataFim
    )}`;
  }

  mounted() {
    // this.$nextTick(() => {
    //   this.modalAbertaAnaliseFinanceira = true;
    // });

    this.preencherTreeContas();
    this.preencherListaNaturezasContaAgrupada();
    this.preencherGrafico();
  }

  dadosPie() {
    if (!this.dadosGrafico.datasets || !this.dadosGrafico.months)
      return { labels: [], values: [], colors: [] };

    // Aqui assumimos que queremos somar os datasets ou escolher só um
    const dataset = this.dadosGrafico?.datasets[0]; // por exemplo
    const retorno = {
      labels: this.dadosGrafico?.months,
      values: dataset?.data,
      colors: dataset?.color ? dataset?.data.map(() => dataset?.color) : [],
    };

    return retorno;
  }

  private async preencherGrafico() {
    let service = this.visaoDetalhada
      ? LancamentoService.montarGraficoDetalhado.bind(LancamentoService)
      : LancamentoService.montarGraficoSimplificado.bind(LancamentoService);

    await service(
      this.filtro.dataInicio,
      this.filtro.dataFim,
      this.contextoContaSelecionado?.id || null,
      this.naturezaContaSelecionada?.id || null
    )
      .then((response) => {
        this.dadosGrafico = response.data;

        this.$nextTick(() => {
          this.keyGrafico += 1;
        });
      })
      .catch((error) => {
        console.error("Erro ao buscar dados para o gráfico:", error);
      });
  }

  public handleSelecionouContextoNatureza(itemSelecionado: {
    data: NaturezaContaDTO | NaturezaContaDTO;
    info: {
      type: "parent" | "child";
      parentIndex: number;
      childIndex?: number;
    };
  }) {
    if (itemSelecionado && itemSelecionado.info.type === "parent") {
      this.naturezaContaSelecionada = null;
      this.contextoContaSelecionado = itemSelecionado.data;
    } else if (itemSelecionado && itemSelecionado.info.type === "child") {
      this.naturezaContaSelecionada = itemSelecionado.data;

      this.contextoContaSelecionado = null;
    }

    this.preencherGrafico();
  }

  public abrirModalContextoNatureza(acaoBotao: AcaoButtonIcon) {
    this.acaoBotaoModalContextoNatureza = acaoBotao;

    this.modalAbertaContextoNatureza = true;
  }

  public abrirModalConta(acaoBotao: AcaoButtonIcon) {
    this.acaoBotaoModalConta = acaoBotao;
    this.modalAbertaConta = true;
  }

  private async preencherTreeContas() {
    await ContaService.listarTree()
      .then((response) => {
        this.dadosTreeConta = response.data;
      })
      .catch((error) => {
        console.error("Erro ao buscar tree de contas:", error);
      });
  }

  private async preencherListaNaturezasContaAgrupada() {
    await NaturezaContaService.listarAgrupadasPorContexto()
      .then((response) => {
        const todos = {
          id: 0,
          label: "Todos",
          codigo: "TODOS",
          children: [],
        };

        this.naturezasContaAgrupadas = [todos, ...response.data];
      })
      .catch((error) => {
        console.error("Erro ao buscar naturezas de conta agrupadas:", error);
      });
  }

  public async associarNaturezas() {
    const obj: { contas: number[]; naturezaId: number | null | undefined } = {
      contas: this.idsSelecionadosTreeAssociacao,
      naturezaId: this.naturezaContaSelecionada?.id,
    };

    await ContaService.associarNatureza(obj)
      .then(() => {
        this.idsSelecionadosTreeAssociacao = [];
        this.preencherTreeContas();
        this.preencherListaNaturezasContaAgrupada();
      })
      .catch((error) => {
        console.error("Erro ao associar naturezas:", error);
      });
  }

  public async alterouVisualizacaoGrafico(novoTipo: AcaoButtonIcon) {
    this.tipoVisualizacaoGrafico = novoTipo;
  }

  public alterouItensSelecionadosTreeAssociacao(
    itensSelecionados: ContaTreeNodeDTO[]
  ) {
    const somenteIdsFolhas = itensSelecionados
      .filter((item) => !item.children || item.children.length === 0)
      .map((item) => item.id);

    this.idsSelecionadosTreeAssociacao = somenteIdsFolhas;
  }

  public async gerarAnaliseFinanceira() {
    if (this.dadosAnaliseFinanceira.length > 0) {
      this.modalAbertaAnaliseFinanceira = true;

      return;
    }

    this.carregandoAnaliseFinanceira = true;

    await LancamentoIAService.analiseFinanceira(this.dadosGrafico)
      .then((response) => {
        this.dadosAnaliseFinanceira = response;

        this.modalAbertaAnaliseFinanceira = true;
      })
      .catch((error) => {
        console.error("Erro ao buscar dados para o gráfico:", error);
      })
      .finally(() => {
        this.carregandoAnaliseFinanceira = false;
      });
  }
}
</script>

<style scoped>
.conteudo-modelagem-financeira-view {
  height: 100%;
  overflow: hidden;

  .container-tree {
    width: 300px;
    height: calc(100vh - 200px);
  }

  .container-panel-menu-natureza-contexto {
    width: 300px;
    position: relative;
  }

  .botoes-associar-natureza {
    display: flex;
    justify-content: flex-end;
    margin: 16px;
  }
}
</style>
