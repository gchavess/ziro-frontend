import { AcaoButtonIcon } from "@/enums/AcaoButtonIcon";
import ContaService from "@/services/conta/ContaService";
import LancamentoService from "@/services/lancamento/LancamentoService";
import NaturezaContaService from "@/services/naturezaconta/NaturezaContaService";
import BiView from "@/views/bi/BiView.vue";
import { mount, VueWrapper } from "@vue/test-utils";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/services/conta/ContaService");
vi.mock("@/services/lancamento/LancamentoService");
vi.mock("@/services/naturezaconta/NaturezaContaService");

describe("BiView.vue", () => {
  let wrapper: VueWrapper<any>;

  const mockTreeContas = [
    { id: 1, label: "Conta 1", children: [] },
    { id: 2, label: "Conta 2", children: [{ id: 3, label: "Subconta" }] },
  ];

  const mockNaturezas = [
    { id: 1, label: "Natureza 1", codigo: "N1", children: [] },
    { id: 2, label: "Natureza 2", codigo: "N2", children: [] },
  ];

  const mockGrafico = {
    months: ["01/2025", "02/2025"],
    datasets: [{ label: "Dataset 1", data: [10, 20], backgroundColor: "#000" }],
  };

  beforeEach(async () => {
    (ContaService.listarTree as any).mockResolvedValue({
      data: mockTreeContas,
    });
    (NaturezaContaService.listarAgrupadasPorContexto as any).mockResolvedValue({
      data: mockNaturezas,
    });
    (LancamentoService.montarGraficoSimplificado as any).mockResolvedValue({
      data: mockGrafico,
    });

    wrapper = mount(BiView, {
      global: {
        stubs: [
          "PanelMenu",
          "ButtonIcon",
          "ContextoNaturezaModal",
          "TreeMultSelect",
          "ContaModal",
          "Tree",
          "PrimaryButton",
          "ChartBar",
          "ChartLine",
          "ChartPie",
          "InputText",
          "SwitchButton",
          "AnaliseFinanceiraModal",
        ],
      },
    });

    await wrapper.vm.$nextTick();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("deve preencher tree, naturezas e gráfico ao montar", () => {
    expect(ContaService.listarTree).toHaveBeenCalled();
    expect(NaturezaContaService.listarAgrupadasPorContexto).toHaveBeenCalled();
    expect(LancamentoService.montarGraficoSimplificado).toHaveBeenCalled();

    expect(wrapper.vm.dadosTreeConta).toEqual(mockTreeContas);
    expect(wrapper.vm.naturezasContaAgrupadas).toContainEqual(
      expect.objectContaining({ codigo: "TODOS" })
    );
    expect(wrapper.vm.dadosGrafico).toEqual(mockGrafico);
  });

  it("deve abrir modal de conta e contexto natureza corretamente", async () => {
    wrapper.vm.abrirModalConta(AcaoButtonIcon.INCLUIR);
    expect(wrapper.vm.modalAbertaConta).toBe(true);
    expect(wrapper.vm.acaoBotaoModalConta).toBe(AcaoButtonIcon.INCLUIR);

    wrapper.vm.abrirModalContextoNatureza(AcaoButtonIcon.ALTERAR);
    expect(wrapper.vm.modalAbertaContextoNatureza).toBe(true);
    expect(wrapper.vm.acaoBotaoModalContextoNatureza).toBe(
      AcaoButtonIcon.ALTERAR
    );

    wrapper.vm.abrirModalAnaliseFinanceira();
    expect(wrapper.vm.modalAbertaAnaliseFinanceira).toBe(true);
  });

  it("deve atualizar seleção no panel menu e tree mult select", async () => {
    const childItem = { data: { id: 2 }, info: { type: "child" } };
    wrapper.vm.handleSelecionouContextoNatureza(childItem);
    expect(wrapper.vm.naturezaContaSelecionada).toEqual(childItem.data);
    expect(wrapper.vm.contextoContaSelecionado).toBeNull();

    const parentItem = { data: { id: 1 }, info: { type: "parent" } };
    wrapper.vm.handleSelecionouContextoNatureza(parentItem);
    expect(wrapper.vm.contextoContaSelecionado).toEqual(parentItem.data);
    expect(wrapper.vm.naturezaContaSelecionada).toBeNull();
  });

  it("deve associar naturezas corretamente", async () => {
    wrapper.vm.naturezaContaSelecionada = { id: 1 };
    wrapper.vm.idsSelecionadosTreeAssociacao = [1, 2];

    (ContaService.associarNatureza as any).mockResolvedValue({});

    await wrapper.vm.associarNaturezas();

    expect(ContaService.associarNatureza).toHaveBeenCalledWith({
      contas: [1, 2],
      naturezaId: 1,
    });
    expect(wrapper.vm.idsSelecionadosTreeAssociacao).toEqual([]);
    expect(ContaService.listarTree).toHaveBeenCalled();
    expect(NaturezaContaService.listarAgrupadasPorContexto).toHaveBeenCalled();
  });

  it("deve alterar visualização do gráfico", async () => {
    wrapper.vm.alterouVisualizacaoGrafico(AcaoButtonIcon.GRAFICO_PIZZA);
    expect(wrapper.vm.tipoVisualizacaoGrafico).toBe(
      AcaoButtonIcon.GRAFICO_PIZZA
    );
  });

  it("deve atualizar ids selecionados ao alterar itens do tree mult select", () => {
    const itens = [
      { id: 1, children: [] },
      { id: 2, children: [{ id: 3 }] },
    ];

    wrapper.vm.alterouItensSelecionadosTreeAssociacao(itens);

    expect(wrapper.vm.idsSelecionadosTreeAssociacao).toEqual([1]);
  });

  it("deve atualizar filtro e preencher gráfico", async () => {
    wrapper.vm.filtro.dataInicio = "2025-05-01";
    wrapper.vm.filtro.dataFim = "2025-05-31";

    await wrapper.vm.preencherGrafico();

    expect(LancamentoService.montarGraficoSimplificado).toHaveBeenCalledWith(
      "2025-05-01",
      "2025-05-31",
      null,
      null
    );
  });
});
