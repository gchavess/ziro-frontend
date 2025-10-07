import { AcaoButtonIcon } from "@/enums/AcaoButtonIcon";
import ContaService from "@/services/conta/ContaService";
import ContaModal from "@/views/bi/modal/ContaModal.vue";
import { mount, VueWrapper } from "@vue/test-utils";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/services/conta/ContaService");

describe("ContaModal.vue", () => {
  let wrapper: VueWrapper<any>;

  const contaMock = {
    id: 1,
    descricao: "Conta 1",
    codigo: "C1",
    observacao: "",
    paiId: null,
  };

  beforeEach(() => {
    wrapper = mount(ContaModal, {
      props: {
        modalAberta: true,
      },
    });

    vi.clearAllMocks();
  });

  it("deve criar uma nova conta ao salvar INCLUIR", async () => {
    await wrapper.setProps({
      acao: AcaoButtonIcon.INCLUIR,
      itemTreeContaSelecionado: { id: 10 },
    });

    (ContaService.criar as any).mockResolvedValue({});

    wrapper.vm.inicializar(); // força preencher paiId
    await wrapper.vm.salvar();

    expect(ContaService.criar).toHaveBeenCalledWith(
      expect.objectContaining({
        paiId: 10,
      })
    );
  });

  it("deve alterar uma conta ao salvar ALTERAR", async () => {
    await wrapper.setProps({
      acao: AcaoButtonIcon.ALTERAR,
      itemTreeContaSelecionado: contaMock,
    });

    (ContaService.alterar as any).mockResolvedValue({});

    wrapper.vm.inicializar(); // força preencher o form
    await wrapper.vm.salvar();

    expect(ContaService.alterar).toHaveBeenCalledWith(
      expect.objectContaining({
        id: contaMock.id,
        descricao: contaMock.descricao,
        codigo: contaMock.codigo,
        observacao: contaMock.observacao,
      })
    );
  });

  it("deve excluir uma conta ao salvar EXCLUIR", async () => {
    await wrapper.setProps({
      acao: AcaoButtonIcon.EXCLUIR,
      itemTreeContaSelecionado: contaMock,
    });

    (ContaService.excluir as any).mockResolvedValue({});

    await wrapper.vm.salvar();

    expect(ContaService.excluir).toHaveBeenCalledWith(contaMock.id);
  });

  it("não deve tentar excluir se itemTreeContaSelecionado for nulo", async () => {
    await wrapper.setProps({
      acao: AcaoButtonIcon.EXCLUIR,
      itemTreeContaSelecionado: null,
    });

    await wrapper.vm.salvar();

    expect(ContaService.excluir).not.toHaveBeenCalled();
  });

  it("deve emitir recarregarTreeContas e fechar modal após salvar INCLUIR", async () => {
    await wrapper.setProps({
      acao: AcaoButtonIcon.INCLUIR,
      itemTreeContaSelecionado: { id: 20 },
    });
    (ContaService.criar as any).mockResolvedValue({});

    wrapper.vm.inicializar();
    await wrapper.vm.salvar();

    expect(wrapper.emitted("recarregarTreeContas")).toBeTruthy();
    expect(wrapper.emitted("modalAberta")?.[0]).toEqual([false]);
  });

  it("deve emitir recarregarTreeContas e fechar modal após salvar ALTERAR", async () => {
    await wrapper.setProps({
      acao: AcaoButtonIcon.ALTERAR,
      itemTreeContaSelecionado: contaMock,
    });
    (ContaService.alterar as any).mockResolvedValue({});

    wrapper.vm.inicializar();
    await wrapper.vm.salvar();

    expect(wrapper.emitted("recarregarTreeContas")).toBeTruthy();
    expect(wrapper.emitted("modalAberta")?.[0]).toEqual([false]);
  });

  it("deve resetar o formulário e fechar modal ao cancelar", async () => {
    wrapper.vm.form = { ...contaMock };

    await wrapper.vm.cancelar();

    expect(wrapper.emitted("modalAberta")?.[0]).toEqual([false]);
    expect(wrapper.vm.form).toEqual({
      id: null,
      descricao: "",
      codigo: "",
      observacao: "",
      paiId: null,
    });
  });
});
