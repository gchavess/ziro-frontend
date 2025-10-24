<template>
  <div class="app-container">
    <nav v-if="mostrarBarraNavegacao" class="navbar">
      <div class="navbar-logo">Ziro</div>

      <div class="navbar-link-user">
        <ul class="navbar-links">
          <li>
            <router-link to="/fontes-dados" active-class="active">
              Minhas Fontes de Dados
            </router-link>
          </li>
          <li>
            <router-link to="/movimentacao-financeira" active-class="active">
              Movimentação Financeira
            </router-link>
          </li>
          <li>
            <router-link to="/bi" active-class="active">
              BI Financeiro
            </router-link>
          </li>
        </ul>

        <div class="usuario-dropdown" @click="toggleDropdown">
          <div class="icone-usuario">
            {{ usuario.iniciaisNome }}
          </div>
          <span>{{ usuario.nome }}</span>
          <svg
            class="icon"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path :d="mdiChevronDown" />
          </svg>

          <ul v-if="dropdownAberto" class="dropdown-menu">
            <li @click="logout">Sair</li>
          </ul>
        </div>
      </div>
    </nav>
    <main :class="{ 'main-content': true, 'with-nav': mostrarBarraNavegacao }">
      <Toaster />

      <router-view />
    </main>
  </div>
</template>

<script lang="ts">
import Toaster from "@/components/toaster/Toaster.vue";
import AuthService from "@/services/auth/AuthService";
import { authState, clearAuth } from "@/store/auth";
import { mdiChevronDown } from "@mdi/js";
import { Component, Vue } from "vue-facing-decorator";
import { useRoute } from "vue-router";

@Component({
  components: { Toaster },
  directives: {},
  emits: [],
})
export default class App extends Vue {
  private route = useRoute();
  private dropdownAberto = false;

  public mdiChevronDown = mdiChevronDown;

  public get usuario() {
    return authState;
  }

  mounted() {
    this.inicializar();
    document.addEventListener("click", this.handleClickOutside);
  }

  beforeUnmount() {
    document.removeEventListener("click", this.handleClickOutside);
  }

  private inicializar() {
    this.validarAutenticacao();
  }

  public get mostrarBarraNavegacao(): boolean {
    const nomesQueNaoMostramBarra = ["Login", "Cadastro"];
    return !nomesQueNaoMostramBarra.includes(this.route.name as string);
  }

  private validarAutenticacao() {
    AuthService.validarToken().catch(() => {
      clearAuth();
      this.$router.push({ name: "Login" });
    });
  }

  public toggleDropdown() {
    this.dropdownAberto = !this.dropdownAberto;
  }

  private handleClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const dropdown = this.$el.querySelector(".usuario-dropdown");
    if (dropdown && !dropdown.contains(target)) {
      this.dropdownAberto = false;
    }
  }

  public logout() {
    clearAuth();
    this.$router.push({ name: "Login" });
  }
}
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 3rem;
  background: linear-gradient(90deg, #ffffff, #f8f9fa);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  font-family: "Inter", sans-serif;
  /* position: sticky; */
  top: 0;
  z-index: 100;
}

.navbar-logo {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--color-primary);
  letter-spacing: -0.5px;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.navbar-logo:hover {
  transform: scale(1.05);
}

.navbar-link-user {
  display: flex;
  flex-direction: row;
  gap: 2rem;
}

.navbar-links {
  display: flex;
  list-style: none;
  gap: 2rem;
  margin: 0;
  padding: 0;
}

.navbar-links a {
  color: #555555;
  text-decoration: none;
  font-size: 1rem;
  padding: 0.5rem 0;
  position: relative;
  transition: color 0.3s ease;
}

.navbar-links a::after {
  content: "";
  position: absolute;
  width: 0;
  height: 2px;
  bottom: -4px;
  left: 0;
  background-color: var(--color-primary);
  transition: width 0.3s ease;
}

.navbar-links a:hover::after {
  width: 100%;
}

.navbar-links a.active {
  color: var(--color-primary);
  font-weight: 600;
}

.main-content {
  background-color: var(--color-hover-bg);
  font-family: "Inter", sans-serif;
  height: calc(100vh - 74px);
  padding: 0;
}

.main-content.with-nav {
  padding: 2rem 2rem 0 2rem;
}

.usuario-dropdown {
  position: relative;
  cursor: pointer;
  display: flex;
  align-items: center;
  font-weight: 500;
  color: #555555;
}

.usuario-dropdown span {
  user-select: none;
}

.icone-usuario {
  background-color: var(--color-text);
  border-radius: 50%;
  width: 24px;
  height: 24px;
  color: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  margin-right: 0.3rem;
}

.dropdown-menu {
  position: absolute;
  top: 120%;
  right: 0;
  background: white;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
  list-style: none;
  padding: 0.5rem 0;
  margin: 0;
  border-radius: 8px;
  min-width: 120px;
  z-index: 50;
}

.dropdown-menu li {
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: background 0.2s ease;
}

.dropdown-menu li:hover {
  background: #f3f4f6;
}
</style>
