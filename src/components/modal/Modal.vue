<!-- Modal.vue -->
<template>
  <div v-if="modalAberta" class="modal-overlay">
    <div class="modal-content">
      <slot name="header">
        <h2 class="text-xl font-semibold mb-4">Modal</h2>
      </slot>

      <slot name="body" />

      <div class="modal-actions">
        <primary-button
          texto="Salvar"
          :cor="buttonColor.PRIMARIO"
          :desabilitado="botaoSalvarDesabilitado"
          @click="salvar"
        />
        <primary-button
          texto="Cancelar"
          :cor="buttonColor.SECUNDARIO"
          @click="cancelar"
        />
      </div>

      <button class="modal-close" @click="cancelar">&times;</button>
    </div>
  </div>
</template>

<script lang="ts">
import PrimaryButton from "@/components/button/PrimaryButton.vue";
import { ButtonColor } from "@/enums/ButtonColor";
import { Component, Prop, Vue } from "vue-facing-decorator";

@Component({
  components: { PrimaryButton },
  emits: ["cancelar", "salvar"],
})
export default class Modal extends Vue {
  @Prop({ type: Boolean, default: false })
  public modalAberta = false;

  @Prop({ type: Boolean, default: false })
  public botaoSalvarDesabilitado = false;

  public buttonColor = ButtonColor;

  public cancelar() {
    this.$emit("cancelar");
  }

  public salvar() {
    this.$emit("salvar");
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
}

.modal-content {
  background-color: #ffffff;
  border-radius: 0.5rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  width: 100%;
  max-width: 420px;
  padding: 1.5rem;
  position: relative;
  animation: fadeIn 0.2s ease-out;
}

.modal-content h2 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #111827;
}

.modal-content label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.25rem;
  color: #374151;
}

.modal-content input,
.modal-content select {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  margin-bottom: 0.75rem;
  transition: border-color 0.2s;
}

.modal-content input:focus,
.modal-content select:focus {
  border-color: #2563eb;
  outline: none;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 1rem;
}

.modal-close {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  background: none;
  border: none;
  font-size: 1.25rem;
  color: #6b7280;
  cursor: pointer;
}

.modal-close:hover {
  color: #111827;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.98);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
