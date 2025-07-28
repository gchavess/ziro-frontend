import { createRouter, createWebHistory } from "vue-router";

import LoginView from "@/views/login/LoginView.vue";
import ModelagemFinanceiraView from "@/views/modelagemfinanceira/ModelagemFinanceiraView.vue";
import MovimentacaoFinanceiraView from "@/views/movimentacaofinanceira/MovimentacaoFinanceiraView.vue";

const routes = [
  {
    path: "/",
    name: "Login",
    component: LoginView,
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
