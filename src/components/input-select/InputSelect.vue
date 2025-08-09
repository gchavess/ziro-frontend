<template>
  <div class="input-container">
    <select
      id="input-select"
      name="input-select"
      :value="modelValue"
      @change="onChange"
      @focus="onFocus"
      @blur="onBlur"
      aria-labelledby="label-select"
    >
      <option disabled value="">Selecione uma opção</option>
      <option
        v-for="option in options"
        :key="option.value"
        :value="option.value"
      >
        {{ option.label }}
      </option>
    </select>
    <label class="label" for="input-select" id="label-select">
      <div class="text">{{ label }}</div>
    </label>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-facing-decorator";

interface Option {
  label: string;
  value: string;
}

@Component
export default class InputSelect extends Vue {
  @Prop({ type: String, default: "" }) modelValue!: string;
  @Prop({ type: Array, default: () => [] }) options!: Option[];
  @Prop({ type: String, default: "Texto" }) label!: string;

  isFocused = false;

  onChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.$emit("update:modelValue", value);
  }

  onFocus() {
    this.isFocused = true;
  }

  onBlur() {
    this.isFocused = false;
  }
}
</script>

<style>
.input-container {
  position: relative;
}

select {
  height: 48px;
  width: 100%;
  border: 1px solid #c0c0c0;
  border-radius: 4px;
  box-sizing: border-box;
  padding-left: 16px;
  font-family: "Segoe UI", sans-serif;
  font-size: 16px;
  background-color: var(--color-bg);
  transition: border 0.2s ease-in-out;
  appearance: none;
  color: var(--text-color);
}

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
  font-family: "Segoe UI", sans-serif;
  font-size: 16px;
}

select:focus {
  outline: none;
  border: 2px solid var(--color-primary);
}

select:focus + .label .text,
:not(select[value=""]) + .label .text {
  font-size: 12px;
  transform: translate(0, -150%);
  background-color: var(--color-bg);
  padding: 0 4px;
}
</style>
