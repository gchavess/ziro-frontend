<template>
  <div class="input-container">
    <input
      id="input-text"
      name="input-text"
      :type="type"
      :value="modelValue"
      @input="onInput"
      @focus="onFocus"
      @blur="onBlur"
      aria-labelledby="label-input"
      autocomplete="off"
      spellcheck="false"
    />
    <label class="label" for="input-text" id="label-input">
      <div class="text">{{ label }}</div>
    </label>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-facing-decorator";

@Component
export default class InputText extends Vue {
  @Prop({ type: String, default: "" }) modelValue!: string;
  @Prop({ type: String, default: "Texto" }) label!: string;
  @Prop({ type: String, default: "text" }) type!: string;

  isFocused = false;

  onInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
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

<style scoped>
.input-container {
  position: relative;
  color: var(--color-text);
}

input {
  height: 48px;
  width: 100%;
  border: 1px solid #c0c0c0;
  border-radius: 4px;
  box-sizing: border-box;
  padding: 16px;
  font-family: "Segoe UI", sans-serif;
  font-size: 16px;
  background-color: var(--color-bg);
  transition: border 0.2s ease-in-out;
  color: var(--color-text);
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
  color: var(--color-text);
  font-family: "Segoe UI", sans-serif;
  font-size: 16px;
}

input:focus {
  outline: none;
  border: 2px solid var(--color-primary);
}

input:focus + .label .text,
:not(input[value=""]) + .label .text {
  font-size: 12px;
  transform: translate(0, -150%);
  background-color: var(--color-bg);
  padding: 0 4px;
}

input:focus + .label .text {
  color: var(--color-primary);
}

input:focus + .label .text,
input:not(:placeholder-shown) + .label .text {
  font-size: 12px;
  transform: translate(0, -150%);
  background-color: var(--color-bg);
  padding: 0 4px;
}
</style>
