<template>
  <div class="p-6">
    <h1 class="titulo">Modelagem Financeira</h1>
    <button-icon
      @click="abrirModal(acaoButtonIcon.INCLUIR)"
      :acao="acaoButtonIcon.INCLUIR"
    />
    <button-icon
      @click="abrirModal(acaoButtonIcon.ALTERAR)"
      :acao="acaoButtonIcon.ALTERAR"
      :desabilitado="
        (!contextoContaSelecionado && !naturezaContaSelecionada) ||
        contextoContaSelecionado?.codigo === 'TODOS'
      "
    />
    <button-icon
      @click="abrirModal(acaoButtonIcon.EXCLUIR)"
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
  </div>

  <ContextoNaturezaModal
    :modalAberta="modalAbertaContextoNatureza"
    :acao="acaoBotaoContextoNatureza"
    :naturezaContaSelecionada="naturezaContaSelecionada"
    :contextoContaSelecionado="contextoContaSelecionado"
    @recarregarPanelMenuContextoNatureza="preencherListaNaturezasContaAgrupada"
    @modalAberta="modalAbertaContextoNatureza = $event"
  ></ContextoNaturezaModal>
</template>

<script lang="ts">
import ButtonIcon from "@/components/button-icon/ButtonIcon.vue";
import PanelMenu from "@/components/panel-menu/PanelMenu.vue";
import { AcaoButtonIcon } from "@/enums/AcaoButtonIcon";
import { ContextoContaDTO } from "@/interface/contextoconta/ContextoContaDTO";
import { NaturezaContaAgrupadaDTO } from "@/interface/naturezaconta/NaturezaContaAgrupadaDTO";
import { NaturezaContaDTO } from "@/interface/naturezaconta/NaturezaContaDTO";
import NaturezaContaService from "@/services/naturezaconta/NaturezaContaService";
import ContextoNaturezaModal from "@/views/modelagemfinanceira/modal/ContextoNaturezaModal.vue";
import { Component, Vue } from "vue-facing-decorator";

@Component({
  components: { PanelMenu, ButtonIcon, ContextoNaturezaModal },
})
export default class ModelagemFinanceiraView extends Vue {
  public acaoButtonIcon = AcaoButtonIcon;
  public acaoBotaoContextoNatureza: AcaoButtonIcon | null = null;
  public modalAbertaContextoNatureza: boolean = false;

  public naturezasContaAgrupadas: NaturezaContaAgrupadaDTO[] = [];

  public naturezaContaSelecionada: NaturezaContaDTO | null = null;
  public contextoContaSelecionado: ContextoContaDTO | null = null;

  mounted() {
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

  public abrirModal(acaoBotao: AcaoButtonIcon) {
    this.acaoBotaoContextoNatureza = acaoBotao;
    this.modalAbertaContextoNatureza = true;
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
}
</script>

<style scoped></style>
