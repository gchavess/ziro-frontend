import InputCurrency from "@/components/input-currency/InputCurrency.vue";
import InputSelect from "@/components/input-select/InputSelect.vue";
import InputText from "@/components/input-text/InputText.vue";
import Modal from "@/components/modal/Modal.vue";
import { AcaoButtonIcon } from "@/enums/AcaoButtonIcon";
import ContaService from "@/services/conta/ContaService";
import LancamentoModal from "@/views/movimentacaofinanceira/lancamento/LancamentoModal.vue";
import { mount, VueWrapper } from "@vue/test-utils";

vi.mock("@/services/conta/ContaService");
vi.mock("@/services/lancamento/LancamentoService");

describe("LancamentoModal.vue", () => {
  let wrapper: VueWrapper<any>;

  const mockListaContas = [
    { label: "Conta 1", value: "1" },
    { label: "Conta 2", value: "2" },
  ];

  beforeEach(async () => {
    // Mock de listarDropdown
    (ContaService.listarDropdown as any).mockResolvedValue({
      data: mockListaContas,
    });

    wrapper = mount(LancamentoModal, {
      props: {
        modalAberta: false, // Começa fechado para disparar watch
        acao: AcaoButtonIcon.INCLUIR,
      },
      global: {
        stubs: { Modal, InputText, InputCurrency, InputSelect },
      },
    });

    // Abrir modal para disparar watch
    await wrapper.setProps({ modalAberta: true });
    await wrapper.vm.$nextTick();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("deve inicializar modal e listar contas", async () => {
    expect(ContaService.listarDropdown).toHaveBeenCalled();
    expect(wrapper.vm.listaContas).toEqual(mockListaContas);
  });

  it("deve renderizar título correto para cada ação", async () => {
    await wrapper.setProps({ acao: AcaoButtonIcon.INCLUIR });
    expect(wrapper.vm.tituloModal).toBe("Novo Lançamento");

    await wrapper.setProps({ acao: AcaoButtonIcon.ALTERAR });
    expect(wrapper.vm.tituloModal).toBe("Alterar Lançamento");

    await wrapper.setProps({ acao: AcaoButtonIcon.EXCLUIR });
    expect(wrapper.vm.tituloModal).toBe("Excluir Lançamento");
  });

  it("deve preencher formulário ao alterar lançamento", async () => {
    const lancamentoSelecionado = {
      id: 1,
      descricao: "Teste",
      dataVencimento: "2025-10-03",
      dataPagamento: "2025-10-04",
      valorBruto: 100,
      conta: { id: "1" },
    };

    await wrapper.setProps({
      acao: AcaoButtonIcon.ALTERAR,
      lancamentoSelecionado,
    });

    await wrapper.vm.inicializar();

    expect(wrapper.vm.form.descricao).toBe("Teste");
    expect(wrapper.vm.form.conta.id).toBe("1");
  });

  it("deve chamar criarLancamento ao salvar com ação INCLUIR", async () => {
    const spyCriar = vi
      .spyOn(wrapper.vm, "criarLancamento")
      .mockResolvedValue(undefined);

    await wrapper.vm.salvar();

    expect(spyCriar).toHaveBeenCalled();
  });

  it("deve chamar alterarLancamento ao salvar com ação ALTERAR", async () => {
    await wrapper.setProps({ acao: AcaoButtonIcon.ALTERAR });
    const spyAlterar = vi
      .spyOn(wrapper.vm, "alterarLancamento")
      .mockResolvedValue(undefined);

    await wrapper.vm.salvar();

    expect(spyAlterar).toHaveBeenCalled();
  });

  it("deve chamar excluirLancamento ao salvar com ação EXCLUIR", async () => {
    await wrapper.setProps({ acao: AcaoButtonIcon.EXCLUIR });
    const spyExcluir = vi
      .spyOn(wrapper.vm, "excluirLancamento")
      .mockResolvedValue(undefined);

    await wrapper.vm.salvar();

    expect(spyExcluir).toHaveBeenCalled();
  });

  it("deve emitir evento modalAberta false ao cancelar", async () => {
    await wrapper.vm.cancelar();
    expect(wrapper.emitted().modalAberta[0]).toEqual([false]);
  });

  it("deve desabilitar botão ao selecionar conta com children", async () => {
    const event = { value: "1", children: [{ label: "Subconta", value: "2" }] };
    wrapper.vm.inputSelectValorContaAlterado(event as any);
    expect(wrapper.vm.botaoSalvarDesabilitado).toBe(true);
  });

  it("deve habilitar botão ao selecionar conta sem children", async () => {
    const event = { value: "1", children: [] };
    wrapper.vm.inputSelectValorContaAlterado(event as any);
    expect(wrapper.vm.botaoSalvarDesabilitado).toBe(false);
  });
});
