import { AcaoButtonIcon } from "@/enums/AcaoButtonIcon";
import ContextoContaService from "@/services/contextoconta/ContextoContaService";
import NaturezaContaService from "@/services/naturezaconta/NaturezaContaService";
import ContextoNaturezaModal from "@/views/bi/modal/ContextoNaturezaModal.vue";
import { mount, VueWrapper } from "@vue/test-utils";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/services/contextoconta/ContextoContaService");
vi.mock("@/services/naturezaconta/NaturezaContaService");

describe("ContextoNaturezaModal.vue", () => {
  let wrapper: VueWrapper<any>;

  const contextoContaMock = {
    id: 1,
    descricao: "Contexto 1",
    codigo: "C1",
    observacao: "",
  };

  const naturezaContaMock = {
    id: 2,
    descricao: "Natureza 1",
    codigo: "N1",
    observacao: "",
    contextoConta: { id: 1 },
  };

  beforeEach(() => {
    wrapper = mount(ContextoNaturezaModal, {
      props: {
        modalAberta: true,
      },
    });

    vi.clearAllMocks();
  });

  it("deve chamar criarContextoConta ao salvar uma nova contexto", async () => {
    await wrapper.setProps({
      acao: AcaoButtonIcon.INCLUIR,
      contextoContaSelecionado: { id: null, codigo: "TODOS" },
    });
    (ContextoContaService.criar as any).mockResolvedValue({});

    await wrapper.vm.salvar();

    expect(ContextoContaService.criar).toHaveBeenCalledWith(
      expect.objectContaining({
        contextoConta: { id: null },
      })
    );
  });

  it("deve chamar alterarContextoConta ao salvar alteração de contexto", async () => {
    await wrapper.setProps({
      acao: AcaoButtonIcon.ALTERAR,
      contextoContaSelecionado: contextoContaMock,
    });

    (ContextoContaService.alterar as any).mockResolvedValue({});

    // Inicializa o form manualmente, pois o watcher não dispara
    wrapper.vm.inicializar();

    await wrapper.vm.salvar();

    expect(ContextoContaService.alterar).toHaveBeenCalledWith(
      expect.objectContaining({
        id: contextoContaMock.id,
        descricao: contextoContaMock.descricao,
        codigo: contextoContaMock.codigo,
        observacao: contextoContaMock.observacao,
      })
    );
  });

  it("deve chamar criarNaturezaConta ao salvar uma nova natureza", async () => {
    await wrapper.setProps({
      acao: AcaoButtonIcon.INCLUIR,
      contextoContaSelecionado: { id: 1 },
    });
    (NaturezaContaService.criar as any).mockResolvedValue({});

    await wrapper.vm.salvar();

    expect(NaturezaContaService.criar).toHaveBeenCalledWith(
      expect.objectContaining({
        contextoConta: { id: 1 },
      })
    );
  });

  it("deve chamar alterarNaturezaConta ao salvar alteração de natureza", async () => {
    await wrapper.setProps({
      acao: AcaoButtonIcon.ALTERAR,
      naturezaContaSelecionada: naturezaContaMock,
    });

    (NaturezaContaService.alterar as any).mockResolvedValue({});

    // Inicializa o form manualmente
    wrapper.vm.inicializar();

    await wrapper.vm.salvar();

    expect(NaturezaContaService.alterar).toHaveBeenCalledWith(
      expect.objectContaining({
        id: naturezaContaMock.id,
        descricao: naturezaContaMock.descricao,
        codigo: naturezaContaMock.codigo,
        contextoConta: { id: naturezaContaMock.contextoConta.id },
        observacao: naturezaContaMock.observacao,
      })
    );
  });

  it("deve chamar excluirContextoConta ao salvar exclusão de contexto", async () => {
    await wrapper.setProps({
      acao: AcaoButtonIcon.EXCLUIR,
      contextoContaSelecionado: contextoContaMock,
    });
    (ContextoContaService.excluir as any).mockResolvedValue({});

    await wrapper.vm.salvar();

    expect(ContextoContaService.excluir).toHaveBeenCalledWith(
      contextoContaMock.id
    );
  });

  it("deve chamar excluirNaturezaConta ao salvar exclusão de natureza", async () => {
    await wrapper.setProps({
      acao: AcaoButtonIcon.EXCLUIR,
      naturezaContaSelecionada: naturezaContaMock,
    });
    (NaturezaContaService.excluir as any).mockResolvedValue({});

    await wrapper.vm.salvar();

    expect(NaturezaContaService.excluir).toHaveBeenCalledWith(
      naturezaContaMock.id
    );
  });

  it("deve resetar o formulário e fechar modal ao cancelar", async () => {
    await wrapper.vm.cancelar();
    expect(wrapper.emitted("modalAberta")?.[0]).toEqual([false]);
    expect(wrapper.vm.form).toEqual({
      id: null,
      descricao: "",
      codigo: "",
      observacao: "",
      contextoConta: { id: null },
    });
  });
});
