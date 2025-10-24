<template>
  <div class="input-container">
    <div
      class="input-select"
      @click="toggleDropdown"
      :class="{ focused: isOpen || modelValue }"
    >
      <span>{{ selectedLabel || "Selecione uma opção" }}</span>
      <span class="arrow">▼</span>
    </div>

    <ul v-if="isOpen" class="dropdown">
      <option-item
        v-for="option in options"
        :key="option.value || option.label"
        :option="option"
        @select="onSelect"
      />
    </ul>

    <label class="label">
      <div class="text">{{ label }}</div>
    </label>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-facing-decorator";
import OptionItem from "./OptionItem.vue";

interface Option {
  label: string;
  value?: string;
  children?: Option[];
}

@Component({ components: { OptionItem } })
export default class InputSelect extends Vue {
  @Prop({ type: Array, default: () => [] }) options!: Option[];
  @Prop({ type: String, default: "" }) modelValue!: string;
  @Prop({ type: String, default: "Texto" }) label!: string;

  public itemSelecionado: Option | null = null;

  isOpen = false;

  get selectedLabel(): string | null {
    const findLabel = (opts: Option[]): string | null => {
      for (const opt of opts) {
        if (opt.value == this.modelValue)
          if (opt.value == this.modelValue) return opt.label;
        if (opt.children) {
          const childLabel = findLabel(opt.children);
          if (childLabel) return childLabel;
        }
      }
      return null;
    };
    return findLabel(this.options);
  }

  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  onSelect(option: Option) {
    if (option.value) {
      this.$emit("update:modelValue", option.value);
      this.isOpen = false;
    }
  }
}
</script>

<style scoped>
.input-container {
  position: relative;
  font-family: "Segoe UI", sans-serif;
}

/* Estilo do “select” customizado */
.input-select {
  height: 48px;
  width: 100%;
  border: 1px solid #c0c0c0;
  border-radius: 4px;
  box-sizing: border-box;
  padding: 0 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: var(--color-bg);
  color: var(--color-text);
  cursor: pointer;
  transition: border 0.2s ease-in-out;
}

.input-select.focused {
  border: 2px solid var(--color-primary);
}

.arrow {
  margin-left: 8px;
}

/* Dropdown recursivo */
.dropdown {
  list-style: none;
  margin: 0;
  padding: 0;
  border: 1px solid #c0c0c0;
  max-height: 300px;
  overflow-y: auto;
  position: absolute;
  width: 100%;
  background-color: var(--color-bg);
  z-index: 1000;
}

.dropdown ul {
  padding-left: 16px;
}

.option {
  padding: 8px 16px;
  cursor: pointer;
}

.option:hover {
  background-color: #f0f0f0;
}

/* Label flutuante */
.label {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 16px;
  display: flex;
  align-items: center;
  pointer-events: none;
}

.label .text {
  transition: all 0.15s ease-out;
  color: grey;
  font-size: 16px;
}

.input-select.focused + .label .text,
:not(.input-select).focused + .label .text {
  font-size: 12px;
  transform: translate(0, -150%);
  background-color: var(--color-bg);
  padding: 0 4px;
}
</style>
