import LoginView from "@/views/login/LoginView.vue";
import { mount, VueWrapper } from "@vue/test-utils";
import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock do router
const mockRouterPush = vi.fn();

vi.mock("vue-router", () => ({
  useRouter: () => ({
    push: mockRouterPush,
  }),
}));

// Mock do AuthService
const mockLogin = vi.fn();

vi.mock("@/services/auth/AuthService", () => ({
  default: {
    login: (data: any) => mockLogin(data),
  },
}));

// Mock do setAuth
vi.mock("@/store/auth", () => ({
  setAuth: vi.fn(),
}));

describe("LoginView.vue", () => {
  let wrapper: VueWrapper<any>;

  beforeEach(() => {
    wrapper = mount(LoginView, {
      global: {
        mocks: {
          $router: { push: mockRouterPush },
        },
      },
    });

    // Mock global do toast
    (window as any).$toast = {
      error: vi.fn(),
      success: vi.fn(),
    };

    mockLogin.mockReset();
    mockRouterPush.mockReset();
  });

  it("renderiza corretamente a tela de login", () => {
    expect(wrapper.find("h1.login-title").text()).toBe("Ziro");
    expect(wrapper.find("p.login-subtitle").text()).toBe(
      "Faça seu login para continuar"
    );
    expect(wrapper.find("input#email").exists()).toBe(true);
    expect(wrapper.find("input#password").exists()).toBe(true);
    expect(wrapper.find("button.btn-login").exists()).toBe(true);
    expect(wrapper.find("a").text()).toBe("Crie uma agora");
  });

  it("atualiza os campos v-model ao digitar", async () => {
    const emailInput = wrapper.find("input#email");
    const passwordInput = wrapper.find("input#password");

    await emailInput.setValue("teste@teste.com");
    await passwordInput.setValue("123456");

    expect(wrapper.vm.email).toBe("teste@teste.com");
    expect(wrapper.vm.password).toBe("123456");
  });

  it("chama AuthService.login e navega ao fazer login com sucesso", async () => {
    mockLogin.mockResolvedValue({
      data: {
        token: "123token",
        usuarioId: 1,
        nome: "Usuário Teste",
        iniciaisNome: "UT",
      },
    });

    await wrapper.setData({ email: "teste@teste.com", password: "123456" });
    await wrapper.find("form").trigger("submit.prevent");

    expect(mockLogin).toHaveBeenCalledWith({
      email: "teste@teste.com",
      senha: "123456",
    });

    await wrapper.vm.$nextTick();

    expect(mockRouterPush).toHaveBeenCalledWith({
      name: "BI Financeiro",
    });
  });

  it("mostra toast em caso de erro de login", async () => {
    mockLogin.mockRejectedValue(new Error("Erro"));

    await wrapper.setData({ email: "erro@teste.com", password: "0000" });
    await wrapper.find("form").trigger("submit.prevent");

    await wrapper.vm.$nextTick();

    expect(window.$toast.error).toHaveBeenCalledWith(
      "Email ou senha inválidos"
    );
  });

  it("navega para cadastro ao clicar no link", async () => {
    await wrapper.find("a").trigger("click");
    expect(mockRouterPush).toHaveBeenCalledWith({ name: "Cadastro" });
  });
});
