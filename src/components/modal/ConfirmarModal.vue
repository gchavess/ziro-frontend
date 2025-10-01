<template>
  <modal
    :modalAberta="modalAberta"
    :titulo="titulo"
    :tamanho="tamanho"
    @cancelar="$emit('cancelar')"
    @salvar="$emit('confirmar')"
  >
    <template #body>
      <div class="text-center">
        <p class="mb-4">{{ mensagem }}</p>
        <strong v-if="dadoExtra">{{ dadoExtra }}</strong>
      </div>
    </template>
  </modal>
</template>

<script lang="ts">
import Modal from "@/components/modal/Modal.vue";
import { Component, Prop, Vue } from "vue-facing-decorator";

@Component({
  components: { Modal },
  emits: ["cancelar", "confirmar"],
})
export default class ConfirmarModal extends Vue {
  @Prop({ type: Boolean, default: false }) modalAberta!: boolean;
  @Prop({ type: String, default: "Confirmar Ação" }) titulo!: string;
  @Prop({ type: String, default: "Tem certeza que deseja prosseguir?" })
  mensagem!: string;
  @Prop({ type: String, default: "" }) dadoExtra!: string;
  @Prop({ type: String, default: "pequeno" }) tamanho!: string;
}
</script>
