import AnaliseFinanceiraService from "@/services/analisefinanceira/AnaliseFinanceiraService";
import AnaliseFinanceiraModal from "@/views/bi/modal/AnaliseFinanceiraModal.vue";
import { mount, VueWrapper } from "@vue/test-utils";
import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock dos serviços
vi.mock("@/services/analisefinanceira/AnaliseFinanceiraService");
vi.mock("@/services/lancamento/LancamentoIAService");

describe("AnaliseFinanceiraModal.vue", () => {
  let wrapper: VueWrapper<any>;

  const fatoMock = {
    id: 1,
    fato: "Fato Teste",
    causa: ["Causa 1"],
    acao: ["Ação 1"],
    editando: false,
  };

  beforeEach(() => {
    // Mock global de window.$toast
    (window as any).$toast = {
      success: vi.fn(),
      error: vi.fn(),
    };

    wrapper = mount(AnaliseFinanceiraModal, {
      props: {
        modalAberta: false,
        dadosGrafico: {},
      },
    });

    vi.clearAllMocks();
  });

  it("deve inicializar e preencher a lista de análise financeira ao abrir modal", async () => {
    const spy = vi.spyOn(wrapper.vm, "preencherListaAnaliseFinanceira");
    await wrapper.setProps({ modalAberta: true });
    await wrapper.vm.$nextTick(); // garante que o Watch seja disparado
    expect(spy).toHaveBeenCalled();
  });

  it("deve adicionar novo fato via botão CURTIR", async () => {
    wrapper.vm.dadosAnalise = [{ fato: "Novo Fato", acao: [], causa: [] }];

    (AnaliseFinanceiraService.criar as any).mockResolvedValue({
      data: { id: 2, fato: "Novo Fato", acao: [], causa: [] },
    });

    await wrapper.vm.adicionarAnaliseFinanceira(wrapper.vm.dadosAnalise[0]);

    expect(AnaliseFinanceiraService.criar).toHaveBeenCalled();
    expect(wrapper.vm.dadosAnalise[0].id).toBe(2);
    expect(window.$toast.success).toHaveBeenCalledWith(
      "Fato, causas e ações criados com sucesso!"
    );
  });

  it("deve editar e salvar fato existente", async () => {
    wrapper.vm.dadosAnalise = [fatoMock];

    (AnaliseFinanceiraService.alterar as any).mockResolvedValue({});

    wrapper.vm.clicouSalvarAnaliseFinanceira(fatoMock);
    await wrapper.vm.$nextTick();

    expect(AnaliseFinanceiraService.alterar).toHaveBeenCalledWith(
      expect.objectContaining({ id: fatoMock.id })
    );
    expect(window.$toast.success).toHaveBeenCalledWith(
      "Fato alterado com sucesso!"
    );
  });

  it("deve excluir fato selecionado", async () => {
    wrapper.vm.dadosAnalise = [fatoMock];
    wrapper.vm.fatoSelecionadoParaExcluir = fatoMock;
    wrapper.vm.modalConfirmacaoAberta = true;

    (AnaliseFinanceiraService.excluir as any).mockResolvedValue({});

    await wrapper.vm.confirmarExclusao();
    await wrapper.vm.$nextTick();

    expect(AnaliseFinanceiraService.excluir).toHaveBeenCalledWith(fatoMock.id);
    expect(wrapper.vm.dadosAnalise).toHaveLength(0);
    expect(wrapper.vm.modalConfirmacaoAberta).toBe(false);
    expect(window.$toast.success).toHaveBeenCalledWith(
      "Fato excluído com sucesso!"
    );
  });

  it("deve adicionar nova causa e expandir painel", async () => {
    wrapper.vm.dadosAnalise = [fatoMock];
    wrapper.vm.adicionarNovaCausa(fatoMock);
    await wrapper.vm.$nextTick();

    expect(fatoMock.causa.length).toBe(2);
    expect(wrapper.vm.expandirCausas[0]).toBe(true);
  });

  it("deve adicionar nova ação e expandir painel", async () => {
    wrapper.vm.dadosAnalise = [fatoMock];
    wrapper.vm.adicionarNovaAcao(fatoMock);
    await wrapper.vm.$nextTick();

    expect(fatoMock.acao.length).toBe(2);
    expect(wrapper.vm.expandirAcoes[0]).toBe(true);
  });

  it("deve fechar modal ao cancelar", async () => {
    await wrapper.vm.cancelar();
    expect(wrapper.emitted("modalAberta")?.[0]).toEqual([false]);
  });
});
