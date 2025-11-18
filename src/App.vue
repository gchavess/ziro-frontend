<template>
  <div class="app-container">
    <nav v-if="mostrarBarraNavegacao" class="navbar">
      <div class="navbar-logo">Ziro</div>

      <div class="hamburger" @click="toggleMobileMenu">
        <span :class="{ open: mobileMenuAberto }"></span>
        <span :class="{ open: mobileMenuAberto }"></span>
        <span :class="{ open: mobileMenuAberto }"></span>
      </div>

      <div
        class="navbar-link-user"
        :class="{ 'mobile-open': mobileMenuAberto }"
      >
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

@Component({ components: { Toaster } })
export default class App extends Vue {
  private route = useRoute();
  private dropdownAberto = false;
  private mobileMenuAberto = false;

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
    const nomesQueNaoMostramBarra = [
      "Login",
      "Cadastro",
      "Termos e Condições de Uso",
    ];
    return !nomesQueNaoMostramBarra.includes(this.route.name as string);
  }

  private validarAutenticacao() {
    AuthService.validarToken().catch(() => {
      clearAuth();

      if (this.mostrarBarraNavegacao) this.$router.push({ name: "Login" });
    });
  }

  public toggleDropdown() {
    this.dropdownAberto = !this.dropdownAberto;
  }

  public toggleMobileMenu() {
    this.mobileMenuAberto = !this.mobileMenuAberto;
  }

  private handleClickOutside(event: MouseEvent) {
    this.handleFecharDropdownMenuUsuario(event);
    this.handleFecharDropdownMenuMobile(event);
  }

  private handleFecharDropdownMenuUsuario(event: MouseEvent) {
    const target = event.target as HTMLElement;

    const dropdown = this.$el.querySelector(".usuario-dropdown");
    if (dropdown && !dropdown.contains(target)) {
      this.dropdownAberto = false;
    }
  }

  private handleFecharDropdownMenuMobile(event: MouseEvent) {
    const target = event.target as HTMLElement;

    const navbarLinks = this.$el.querySelector(".navbar-link-user");
    const hamburger = this.$el.querySelector(".hamburger");
    if (
      navbarLinks &&
      hamburger &&
      !navbarLinks.contains(target) &&
      !hamburger.contains(target)
    ) {
      this.mobileMenuAberto = false;
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
  z-index: 100;
  position: relative;
}

.navbar-logo {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--color-primary);
  letter-spacing: -0.5px;
  cursor: pointer;
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

.hamburger {
  display: none;
  flex-direction: column;
  gap: 4px;
  cursor: pointer;
}

.hamburger span {
  display: block;
  width: 24px;
  height: 3px;
  background: #555555;
  border-radius: 2px;
  transition: all 0.3s ease;
}

.hamburger span.open:nth-child(1) {
  transform: rotate(45deg) translate(5px, 5px);
}
.hamburger span.open:nth-child(2) {
  opacity: 0;
}
.hamburger span.open:nth-child(3) {
  transform: rotate(-45deg) translate(5px, -5px);
}

@media (max-width: 768px) {
  .hamburger {
    display: flex;
  }

  .navbar-link-user {
    position: absolute;
    top: 100%;
    right: 0;
    background: white;
    flex-direction: column;
    width: 200px;
    gap: 0;
    padding: 1rem;
    border-radius: 0 0 8px 8px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
    transform: translateY(-20px);
    opacity: 0;
    pointer-events: none;
    transition: all 0.3s ease;
  }

  .navbar-link-user.mobile-open {
    transform: translateY(0);
    opacity: 1;
    pointer-events: auto;
  }

  .navbar-links {
    flex-direction: column;
    gap: 1rem;
  }

  .usuario-dropdown {
    margin-top: 1rem;
  }
}
</style>
