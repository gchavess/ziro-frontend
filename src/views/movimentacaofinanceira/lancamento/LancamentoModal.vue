<template>
  <modal
    :modalAberta="modalAbertaLancamento"
    @modalAberta="$emit('modalAbertaLancamento', $event)"
  >
    <template #header>
      <h2>{{ tituloModal }}</h2>
    </template>

    <template #body>
      <form @submit.prevent="salvarLancamento" class="space-y-4">
        <div class="formulario-lancamento">
          <div>
            <input-text v-model="form.descricao" :label="'Descrição'" />
          </div>

          <div class="mt-4">
            <input-select
              v-model="form.categoria"
              :label="'Categoria'"
              :options="[
                { label: 'Opção A', value: 'A' },
                { label: 'Opção B', value: 'B' },
              ]"
            />
          </div>

          <div>
            <input-select
              v-model="form.tipo"
              :label="'Tipo'"
              :options="[
                { label: 'Opção A', value: 'A' },
                { label: 'Opção B', value: 'B' },
              ]"
            />
          </div>

          <div>
            <input-currency v-model="form.valor" :label="'Valor'" />
          </div>

          <div>
            <input-select
              v-model="form.conta"
              :label="'Conta'"
              :options="[
                { label: 'Opção A', value: 'A' },
                { label: 'Opção B', value: 'B' },
              ]"
            />
          </div>
        </div>
      </form>
    </template>

    <template #footer>
      <div class="flex justify-end gap-2">
        <button
          class="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
          @click="$emit('modalAbertaLancamento', false)"
        >
          Cancelar
        </button>
        <button
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          @click="salvarLancamento"
        >
          Salvar
        </button>
      </div>
    </template>
  </modal>
</template>

<script lang="ts">
import InputCurrency from "@/components/input-currency/InputCurrency.vue";
import InputSelect from "@/components/input-select/InputSelect.vue";
import InputText from "@/components/input-text/InputText.vue";
import Modal from "@/components/modal/Modal.vue";
import { AcaoButtonIcon } from "@/enums/AcaoButtonIcon";
import { Component, Prop, Vue } from "vue-facing-decorator";

@Component({
  components: { Modal, InputCurrency, InputText, InputSelect },
})
export default class LancamentoModal extends Vue {
  @Prop({ type: Boolean, default: false })
  public modalAbertaLancamento!: boolean;

  @Prop({ type: AcaoButtonIcon, default: "" })
  public acao!: string;

  public acaoButtonIcon = AcaoButtonIcon;

  public form = {
    descricao: "",
    categoria: "",
    tipo: "",
    valor: 0,
    conta: "",
  };

  public get tituloModal() {
    switch (this.acao) {
      case this.acaoButtonIcon.INCLUIR:
        return "Novo Lançamento";
      case this.acaoButtonIcon.ALTERAR:
        return "Alterar Lançamento";
      case this.acaoButtonIcon.EXCLUIR:
        return "Excluir Lançamento";
      default:
        return "Lançamento";
    }
  }

  public salvarLancamento() {
    // Validação básica (pode melhorar com biblioteca tipo Vuelidate ou Zod)
    if (!this.form.descricao || !this.form.valor || !this.form.tipo) {
      alert("Preencha todos os campos obrigatórios.");
      return;
    }

    console.log("Lançamento salvo:", this.form);
    this.$emit("salvarLancamento", this.form);
    this.$emit("modalAbertaLancamento", false);

    // Resetar formulário após salvar
    this.form = {
      descricao: "",
      categoria: "",
      tipo: "",
      valor: 0,
      conta: "",
    };
  }
}
</script>

<style scoped>
.formulario-lancamento {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  padding-top: 1rem;
}
</style>
