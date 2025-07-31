import { createRouter, createWebHistory } from "vue-router";

import CadastroView from "@/views/login/CadastroView.vue";
import LoginView from "@/views/login/LoginView.vue";
import ModelagemFinanceiraView from "@/views/modelagemfinanceira/ModelagemFinanceiraView.vue";
import MovimentacaoFinanceiraView from "@/views/movimentacaofinanceira/MovimentacaoFinanceiraView.vue";

const routes = [
  {
    path: "/login",
    name: "Login",
    component: LoginView,
  },
  {
    path: "/cadastro",
    name: "Cadastro",
    component: CadastroView,
  },
  {
    path: "/modelagem-financeira",
    name: "Modelagem Financeira",
    component: ModelagemFinanceiraView,
  },
  {
    path: "/movimentacao-financeira",
    name: "Movimentação Financeira",
    component: MovimentacaoFinanceiraView,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
