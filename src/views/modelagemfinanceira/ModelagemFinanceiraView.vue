<template>
  <h1 class="titulo">Modelagem Financeira</h1>

  <div class="flex gap-4 conteudo-modelagem-financeira-view">
    <div class="container-tree">
      <button-icon
        :desabilitado="treeModoAssociacao"
        :acao="acaoButtonIcon.INCLUIR"
        @click="abrirModalConta(acaoButtonIcon.INCLUIR)"
      />
      <button-icon
        :desabilitado="!itemTreeContaSelecionado || treeModoAssociacao"
        :acao="acaoButtonIcon.ALTERAR"
        @click="abrirModalConta(acaoButtonIcon.ALTERAR)"
      />
      <button-icon
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
</template>

<script lang="ts">
import ButtonIcon from "@/components/button-icon/ButtonIcon.vue";
import PrimaryButton from "@/components/button/PrimaryButton.vue";
import Chip from "@/components/chip/Chip.vue";
import PanelMenu from "@/components/panel-menu/PanelMenu.vue";
import TreeMultSelect from "@/components/tree-mult-select/TreeMultSelect.vue";
import Tree from "@/components/tree/Tree.vue";
import { AcaoButtonIcon } from "@/enums/AcaoButtonIcon";
import { ButtonColor } from "@/enums/ButtonColor";
import { ContaTreeNodeDTO } from "@/interface/conta/ContaTreeNodeDTO";
import { ContextoContaDTO } from "@/interface/contextoconta/ContextoContaDTO";
import { NaturezaContaAgrupadaDTO } from "@/interface/naturezaconta/NaturezaContaAgrupadaDTO";
import { NaturezaContaDTO } from "@/interface/naturezaconta/NaturezaContaDTO";
import ContaService from "@/services/conta/ContaService";
import NaturezaContaService from "@/services/naturezaconta/NaturezaContaService";
import ContaModal from "@/views/modelagemfinanceira/modal/ContaModal.vue";
import ContextoNaturezaModal from "@/views/modelagemfinanceira/modal/ContextoNaturezaModal.vue";
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

  mounted() {
    this.preencherTreeContas();
    this.preencherListaNaturezasContaAgrupada();
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

      return;
    }

    if (itemSelecionado && itemSelecionado.info.type === "child") {
      this.naturezaContaSelecionada = itemSelecionado.data;

      this.contextoContaSelecionado = null;
    }
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

  public alterouItensSelecionadosTreeAssociacao(
    itensSelecionados: ContaTreeNodeDTO[]
  ) {
    const somenteIdsFolhas = itensSelecionados
      .filter((item) => !item.children || item.children.length === 0)
      .map((item) => item.id);

    this.idsSelecionadosTreeAssociacao = somenteIdsFolhas;
  }
}
</script>

<style scoped>
.conteudo-modelagem-financeira-view {
  height: 100%;

  .container-tree {
    width: 300px;
  }

  .container-panel-menu-natureza-contexto {
    width: 300px;
    height: 100%;
    position: relative;
  }

  .botoes-associar-natureza {
    position: absolute;
    right: 0;
    bottom: 0;
    margin: 16px;
  }
}
</style>
