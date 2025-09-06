<template>
  <div class="group-button">
    <button
      v-for="acao in acoes"
      :key="acao"
      class="icon-button"
      @click="onClick(acao)"
    >
      <svg class="icon" viewBox="0 0 24 24">
        <path :d="getIconPath(acao)" />
      </svg>
    </button>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-facing-decorator";

import { AcaoButtonIcon } from "@/enums/AcaoButtonIcon";
import { mdiChartBar, mdiChartLine, mdiChartPie, mdiCircle } from "@mdi/js";

@Component
export default class GroupButton extends Vue {
  @Prop({ type: Array, default: () => [AcaoButtonIcon.INCLUIR] })
  public acoes!: AcaoButtonIcon[];

  public getIconPath(acao: AcaoButtonIcon): string {
    switch (acao) {
      case AcaoButtonIcon.GRAFICO_PIZZA:
        return mdiChartPie;
      case AcaoButtonIcon.GRAFICO_BARRA:
        return mdiChartBar;
      case AcaoButtonIcon.GRAFICO_LINHA:
        return mdiChartLine;
      default:
        return mdiCircle;
    }
  }

  private onClick(acao: AcaoButtonIcon) {
    this.$emit("onClick", acao);
  }
}
</script>

<style scoped>
.group-button {
  display: flex;
  gap: 8px;
}

.icon-button {
  background: #e6e6e6;
  border: none;
  border-radius: 6px;
  padding: 8px;
  cursor: pointer;
  transition: background 0.2s;
}

.icon-button:hover {
  background: #dadada;
}

.icon {
  width: 24px;
  height: 24px;
  fill: currentColor;
}
</style>
