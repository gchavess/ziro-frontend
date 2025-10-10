import vue from "@vitejs/plugin-vue";
import path from "path";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: true,
    port: 5173,
    strictPort: true,
    hmr: {
      host: "52.91.183.57",
      protocol: "ws",
    },
  },
});
