<template>
  <button
    :type="tipo"
    :class="[
      'btn',
      `btn--${cor}`,
      { 'btn--disabled': desabilitado || carregando },
    ]"
    :disabled="desabilitado || carregando"
  >
    <span class="btn__content">
      <span v-if="carregando" class="spinner"></span>

      <slot name="icon" />
      <span>{{ texto }}</span>
    </span>
  </button>
</template>

<script lang="ts">
import { ButtonColor } from "@/enums/ButtonColor";
import { ButtonType } from "@/enums/ButtonType";
import { Component, Prop, Vue } from "vue-facing-decorator";

@Component
export default class PrimaryButton extends Vue {
  @Prop({ type: String, default: ButtonColor.PRIMARIO })
  public cor!: ButtonColor;

  @Prop({ type: String, default: ButtonType.BUTTON })
  public tipo!: ButtonType;

  @Prop({ type: String, default: "" })
  public texto!: string;

  @Prop({ type: Boolean, default: false })
  public desabilitado!: boolean;

  @Prop({ type: Boolean, default: false })
  public carregando!: boolean;
}
</script>

<style>
.btn {
  padding: 10px 16px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  border: none;
  transition: background-color 0.2s ease;
  height: 40px;
}

.btn--primario {
  background-color: var(--color-primary);
  color: white;
}

.btn--primario:hover:not(.btn--disabled) {
  background-color: var(--color-primary-light);
}

.btn--secundario {
  background-color: #e5e7eb;
  color: #111827;
}

.btn--secundario:hover:not(.btn--disabled) {
  background-color: #d1d5db;
}

.btn--perigo {
  background-color: #dc2626;
  color: white;
}

.btn--perigo:hover:not(.btn--disabled) {
  background-color: #b91c1c;
}

.btn--alerta {
  background-color: #f7c41e;
  color: white;
}

.btn--disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn__content {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;
}

.spinner {
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-left-color: white;
  border-radius: 50%;
  width: 14px;
  height: 14px;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
