<template>
  <div class="button-icon-wrapper">
    <button
      class="button-icon"
      :disabled="desabilitado"
      :aria-disabled="desabilitado"
    >
      <svg
        class="icon"
        :stroke-width="2"
        viewBox="0 0 24 24"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path :d="iconPath" />
      </svg>
    </button>

    <!-- Tooltip com classe dinâmica baseada na posição -->
    <span v-if="label" :class="['tooltip', `tooltip-${posicaoTooltip}`]">{{
      label
    }}</span>
  </div>
</template>

<script lang="ts">
import { AcaoButtonIcon } from "@/enums/AcaoButtonIcon";
import {
  mdiCheck,
  mdiChevronDown,
  mdiChevronUp,
  mdiCircle,
  mdiCogOutline,
  mdiPencil,
  mdiPlus,
  mdiThumbUpOutline,
  mdiTrashCan,
} from "@mdi/js";
import { Component, Prop, Vue } from "vue-facing-decorator";

@Component
export default class ButtonIcon extends Vue {
  @Prop({ type: AcaoButtonIcon, default: "" }) acao!: AcaoButtonIcon;
  @Prop({ type: Boolean, default: false }) desabilitado!: boolean;
  @Prop({ type: String, default: "" }) labelTooltip!: string;
  @Prop({ type: String, default: "top" }) posicaoTooltip!:
    | "top"
    | "bottom"
    | "left"
    | "right";

  public get iconPath() {
    switch (this.acao) {
      case AcaoButtonIcon.INCLUIR:
        return mdiPlus;
      case AcaoButtonIcon.ALTERAR:
        return mdiPencil;
      case AcaoButtonIcon.EXCLUIR:
        return mdiTrashCan;
      case AcaoButtonIcon.CONFIGURAR:
        return mdiCogOutline;
      case AcaoButtonIcon.CURTIR:
        return mdiThumbUpOutline;
      case AcaoButtonIcon.CHECK:
        return mdiCheck;
      case AcaoButtonIcon.EXPANDIR:
        return mdiChevronDown;
      case AcaoButtonIcon.RECOLHER:
        return mdiChevronUp;
      default:
        return mdiCircle;
    }
  }

  public get label() {
    if (this.labelTooltip) return this.labelTooltip;

    switch (this.acao) {
      case AcaoButtonIcon.INCLUIR:
        return "Incluir";
      case AcaoButtonIcon.ALTERAR:
        return "Alterar";
      case AcaoButtonIcon.EXCLUIR:
        return "Excluir";
      case AcaoButtonIcon.CONFIGURAR:
        return "Configurar";
      case AcaoButtonIcon.CURTIR:
        return "Adicionar";
      case AcaoButtonIcon.CHECK:
        return "Salvar";
      case AcaoButtonIcon.EXPANDIR:
        return "Expandir";
      case AcaoButtonIcon.RECOLHER:
        return "Recolher";
      default:
        return "";
    }
  }
}
</script>

<style scoped>
.button-icon-wrapper {
  position: relative;
  display: inline-block;
}

.button-icon {
  background-color: transparent;
  border: none;
  padding: 8px;
  border-radius: 50%;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease, box-shadow 0.2s ease,
    transform 0.1s ease;
}

.button-icon:hover:not(:disabled) {
  background-color: rgba(0, 0, 0, 0.05);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
}

.button-icon:active:not(:disabled) {
  transform: scale(0.95);
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.2);
}

.button-icon:disabled {
  cursor: default;
  opacity: 0.5;
}

.icon {
  width: 20px;
  height: 20px;
  color: var(--color-text);
}

/* Tooltip padrão */
.tooltip {
  position: absolute;
  background-color: #333;
  color: #fff;
  padding: 5px 8px;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease;
  z-index: 10;
}

.button-icon-wrapper:hover .tooltip {
  opacity: 1;
}

/* Tooltip directions */
.tooltip-top {
  bottom: 125%;
  left: 50%;
  transform: translateX(-50%);
}

.tooltip-top::after {
  content: "";
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border-width: 5px;
  border-style: solid;
  border-color: #333 transparent transparent transparent;
}

.tooltip-bottom {
  top: 125%;
  left: 50%;
  transform: translateX(-50%);
}

.tooltip-bottom::after {
  content: "";
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  border-width: 5px;
  border-style: solid;
  border-color: transparent transparent #333 transparent;
}

.tooltip-left {
  right: 125%;
  top: 50%;
  transform: translateY(-50%);
}

.tooltip-left::after {
  content: "";
  position: absolute;
  right: -5px;
  top: 50%;
  transform: translateY(-50%);
  border-width: 5px;
  border-style: solid;
  border-color: transparent transparent transparent #333;
}

.tooltip-right {
  left: 125%;
  top: 50%;
  transform: translateY(-50%);
}

.tooltip-right::after {
  content: "";
  position: absolute;
  left: -5px;
  top: 50%;
  transform: translateY(-50%);
  border-width: 5px;
  border-style: solid;
  border-color: transparent #333 transparent transparent;
}
</style>
