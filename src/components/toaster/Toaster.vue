<template>
  <div class="toaster">
    <span
      v-for="toast in toasts"
      :key="toast.id"
      class="toast"
      :class="[`toast--${toast.type}`]"
    >
      <span class="toast__label">{{ toast.message }}</span>
      <button class="toast__close" @click.stop="removeToast(toast.id)">
        ✕
      </button>
    </span>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-facing-decorator";

interface Toast {
  id: number;
  message: string;
  type: "success" | "error" | "info";
}

@Component
export default class Toaster extends Vue {
  public toasts: Toast[] = [];
  private nextId = 0;

  mounted() {
    window.$toast = {
      success: (msg: string) => this.addToast(msg, "success"),
      error: (msg: string) => this.addToast(msg, "error"),
      info: (msg: string) => this.addToast(msg, "info"),
    };
  }

  addToast(message: string, type: "success" | "error" | "info") {
    const id = this.nextId++;
    this.toasts.push({ id, message, type });

    setTimeout(() => {
      this.removeToast(id);
    }, 3000);
  }

  removeToast(id: number) {
    this.toasts = this.toasts.filter((t) => t.id !== id);
  }
}
</script>

<style scoped>
.toaster {
  position: fixed;
  top: 20px;
  right: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  z-index: 9999;
}

.toast {
  display: inline-flex;
  align-items: center;
  border-radius: 6px;
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1;
  height: 50px;
  color: white;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  animation: fadein 0.3s;
}

.toast__label {
  white-space: nowrap;
}

.toast__close {
  margin-left: 0.5rem;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 0.9rem;
  line-height: 1;
  color: inherit;
}

.toast--success {
  background-color: #28a745;
}

.toast--error {
  background-color: #dc3545;
}

.toast--info {
  background-color: #17a2b8;
}

@keyframes fadein {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
