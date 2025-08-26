import App from "@/App.vue";
import router from "@/router";
import { createApp } from "vue";

// CSS do Tailwind
import "@/assets/styles/tailwind.css";

// Importação global dos estilos
import "@/assets/styles/main.css";
import "@/assets/styles/reset.css";
import "@/assets/styles/theme.css";

// Importação do estado de autenticação
import { loadAuth } from "@/store/auth";

const app = createApp(App);
loadAuth();

// Usar o router
app.use(router);

// Montar
app.mount("#app");
