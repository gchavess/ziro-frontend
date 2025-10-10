import LancamentoService from "@/services/lancamento/LancamentoService";
import MovimentacaoFinanceiraView from "@/views/movimentacaofinanceira/MovimentacaoFinanceiraView.vue";
import { flushPromises, mount } from "@vue/test-utils";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { nextTick } from "vue";

// Mock do serviço
vi.mock("@/services/lancamento/LancamentoService");

describe("MovimentacaoFinanceiraView.vue", () => {
  const lancamentosMock = [
    {
      descricao: "Receita 1",
      valorBruto: 1000,
      conta: { descricao: "Conta A" },
      dataVencimento: "2025-10-10",
      dataPagamento: "2025-10-11",
    },
    {
      descricao: "Despesa 1",
      valorBruto: 500,
      conta: { descricao: "Conta B" },
      dataVencimento: "2025-10-12",
      dataPagamento: "2025-10-13",
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("chama preencherLancamentos ao montar e preenche tabela", async () => {
    (LancamentoService.listar as any).mockResolvedValueOnce({
      data: lancamentosMock,
    });

    const wrapper = mount(MovimentacaoFinanceiraView);
    await flushPromises();
    await nextTick();

    console.log("this.lancamentos", wrapper.vm.lancamentos);

    const rows = wrapper.findAll("tbody tr");
    // filtra apenas as linhas com dados reais
    const visibleRows = rows.filter(
      (r) => r.text().trim() !== "" && !r.text().includes("Nenhum lançamento")
    );

    expect(visibleRows).toHaveLength(lancamentosMock.length); // 2
    expect(visibleRows[0].text()).toContain("Receita 1");
    expect(visibleRows[1].text()).toContain("Despesa 1");
  });

  it("seleciona lançamento ao clicar na linha", async () => {
    (LancamentoService.listar as any).mockResolvedValueOnce({
      data: lancamentosMock,
    });

    const wrapper = mount(MovimentacaoFinanceiraView);
    await flushPromises();

    console.log("this.lancamentos", wrapper.vm.lancamentos);

    const rows = wrapper.findAll("tbody tr");
    const visibleRows = rows.filter(
      (r) => r.text().trim() !== "" && !r.text().includes("Nenhum lançamento")
    );

    await visibleRows[1].trigger("click");
    expect(wrapper.vm.lancamentoSelecionado).toEqual(lancamentosMock[1]);
  });
});
