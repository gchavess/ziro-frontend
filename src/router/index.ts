import { createRouter, createWebHistory } from "vue-router";

import BiView from "@/views/bi/BiView.vue";
import FonteDadoView from "@/views/fontedado/FonteDadoView.vue";
import CadastroView from "@/views/login/CadastroView.vue";
import LoginView from "@/views/login/LoginView.vue";
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
    path: "/bi",
    name: "BI Financeiro",
    component: BiView,
  },
  {
    path: "/movimentacao-financeira",
    name: "Movimentação Financeira",
    component: MovimentacaoFinanceiraView,
  },
  {
    path: "/fontes-dados",
    name: "Minhas Fontes de Dados",
    component: FonteDadoView,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
