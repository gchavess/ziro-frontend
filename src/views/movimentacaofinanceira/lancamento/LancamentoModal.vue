<template>
  <modal
    :modalAberta="modalAberta"
    :botaoSalvarDesabilitado="botaoSalvarDesabilitado"
    @modalAberta="$emit('modalAberta', $event)"
    @cancelar="cancelar"
    @salvar="salvar"
  >
    <template #header>
      <h2>{{ tituloModal }}</h2>
    </template>

    <template #body>
      <form class="space-y-4">
        <div class="formulario-lancamento">
          <input-text v-model="form.descricao" :label="'Descrição'" />

          <input-text
            v-model="form.dataVencimento"
            :type="'date'"
            :label="'Data de Vencimento'"
          />

          <input-text
            v-model="form.dataPagamento"
            :type="'date'"
            :label="'Data de Pagamento'"
          />

          <div>
            <input-currency v-model="form.valorBruto" :label="'Valor'" />
          </div>

          <div>
            <input-select
              :key="form.conta.id"
              v-model="form.conta.id"
              :label="'Conta'"
              :options="listaContas"
              @modelValue="inputSelectValorContaAlterado"
            />
          </div>
        </div>
      </form>
    </template>
  </modal>
</template>

<script lang="ts">
import InputCurrency from "@/components/input-currency/InputCurrency.vue";
import InputSelect from "@/components/input-select/InputSelect.vue";
import InputText from "@/components/input-text/InputText.vue";
import Modal from "@/components/modal/Modal.vue";
import { AcaoButtonIcon } from "@/enums/AcaoButtonIcon";
import { LancamentoDTO } from "@/interface/lancamento/LancamentoDTO";
import { OptionDTO } from "@/interface/option/OptionDTO";
import ContaService from "@/services/conta/ContaService";
import LancamentoService from "@/services/lancamento/LancamentoService";
import { Component, Prop, Vue, Watch } from "vue-facing-decorator";

@Component({
  components: { Modal, InputCurrency, InputText, InputSelect },
})
export default class LancamentoModal extends Vue {
  @Prop({ type: Boolean, default: false })
  public modalAberta!: boolean;

  @Prop({ type: AcaoButtonIcon, default: "" })
  public acao!: string;

  @Prop({ type: Object, default: null })
  public lancamentoSelecionado: LancamentoDTO | null = null;

  public botaoSalvarDesabilitado: boolean = false;

  public listaContas: OptionDTO[] = [];

  public acaoButtonIcon = AcaoButtonIcon;

  public form: LancamentoDTO = {
    id: null,
    descricao: "",
    observacao: "",
    dataVencimento: "",
    dataPagamento: "",
    valorBruto: null,
    conta: {
      id: null,
    },
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

  @Watch("modalAberta")
  onModalAbertaChange(newValue: boolean) {
    if (newValue) {
      this.inicializar();
    }
  }

  private async inicializar() {
    await this.listarContasDropdown();

    if (
      this.lancamentoSelecionado &&
      this.acao === this.acaoButtonIcon.ALTERAR
    ) {
      console.log("this.lancamentoSelecionado", this.lancamentoSelecionado);
      this.form = {
        ...this.lancamentoSelecionado,
        conta: this.lancamentoSelecionado.conta
          ? { ...this.lancamentoSelecionado.conta }
          : { id: null },
      };
    }
  }

  private async listarContasDropdown() {
    await ContaService.listarDropdown()
      .then((response) => {
        this.listaContas = response.data;
      })
      .catch((error) => {
        console.error("Erro ao listar contas para dropdown:", error);
      });
  }

  public async salvar() {
    switch (this.acao) {
      case this.acaoButtonIcon.INCLUIR:
        this.criarLancamento();
        break;
      case this.acaoButtonIcon.ALTERAR:
        break;
      case this.acaoButtonIcon.EXCLUIR:
        break;
      default:
        break;
    }
  }

  public async criarLancamento() {
    await LancamentoService.criar(this.form)
      .then(() => {
        this.recarregarGridLancamentos();
        this.fecharModal();
      })
      .catch((error) => {
        console.error("Erro ao criar contexto conta:", error);
      });
  }

  public inputSelectValorContaAlterado(event: OptionDTO) {
    if (event.value) this.form.conta.id = event.value;

    if (event.children && event.children.length > 0) {
      this.botaoSalvarDesabilitado = true;
    } else {
      this.botaoSalvarDesabilitado = false;
    }
  }

  public async cancelar() {
    await this.resetarFormulario();
    this.fecharModal();
  }

  private recarregarGridLancamentos() {
    this.$emit("recarregarGridLancamentos");
  }

  private fecharModal() {
    this.$emit("modalAberta", false);
    this.resetarFormulario();
  }

  private resetarFormulario() {
    this.form = {
      id: null,
      descricao: "",
      observacao: "",
      dataVencimento: "",
      dataPagamento: "",
      valorBruto: null,
      conta: {
        id: null,
      },
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
