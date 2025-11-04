<!-- Modal.vue -->
<template>
  <div v-if="modalAberta" class="modal-overlay">
    <div class="modal-content" :class="classeTamanho">
      <span class="titulo-4">{{ titulo }}</span>
      <slot name="header" />

      <div class="container-body-modal" :style="styleContainerBodyModal">
        <slot name="body" />
      </div>

      <div class="modal-actions">
        <primary-button
          v-if="exibirBoaoSalvar"
          texto="Salvar"
          :cor="buttonColor.PRIMARIO"
          :desabilitado="botaoSalvarDesabilitado"
          :carregando="botaoCarregando"
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

  @Prop({ type: String, default: "" })
  public titulo = "";

  @Prop({ type: Boolean, default: false })
  public botaoSalvarDesabilitado = false;

  @Prop({ type: String, default: "medio" }) // pequeno | medio | grande
  public tamanho!: string;

  @Prop({ type: Boolean, default: false })
  public botaoCarregando!: boolean;

  @Prop({ type: Boolean, default: true })
  public exibirBoaoSalvar!: boolean;

  @Prop({ type: Boolean, default: false })
  public exibirBarraRolagem!: boolean;

  public buttonColor = ButtonColor;

  public get classeTamanho() {
    switch (this.tamanho) {
      case "pequeno":
        return "modal-pequeno";
      case "grande":
        return "modal-grande";
      default:
        return "modal-medio";
    }
  }

  public get styleContainerBodyModal() {
    return this.exibirBarraRolagem ? "overflow-y: auto;" : "";
  }

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
  padding: 1.5rem;
  position: relative;
  animation: fadeIn 0.2s ease-out;
}

/* tamanhos */
.modal-pequeno {
  max-width: 320px;
}
.modal-medio {
  max-width: 600px;
}
.modal-grande {
  max-width: 900px;
}

.modal-content .container-body-modal {
  padding-top: 1rem;
  max-height: calc(100vh - 300px);
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
