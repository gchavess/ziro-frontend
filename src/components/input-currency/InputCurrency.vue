<template>
  <div class="input-container">
    <input
      class="input-currency"
      id="fname"
      name="fname"
      type="text"
      :value="displayValue"
      @input="onInput"
      @blur="onBlur"
      @focus="onFocus"
      aria-labelledby="label-fname"
      autocomplete="off"
      spellcheck="false"
    />
    <label class="label" for="fname" id="label-fname">
      <div class="text">{{ label }}</div>
    </label>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-facing-decorator";

@Component
export default class CurrencyInput extends Vue {
  @Prop({ type: Number, default: 0 }) modelValue!: number;
  @Prop({ type: String, default: "Texto" }) label!: string;

  internalValue = this.modelValue;
  isFocused = false;

  @Watch("modelValue")
  onModelValueChanged(newVal: number) {
    if (newVal !== this.internalValue) {
      this.internalValue = newVal;
    }
  }

  get displayValue(): string {
    const val =
      typeof this.internalValue === "number" && this.internalValue !== null
        ? this.internalValue
        : 0;
    if (this.isFocused) {
      return val === 0 ? "" : val.toString().replace(".", ",");
    } else {
      return this.formatCurrency(val);
    }
  }

  onInput(event: Event) {
    const target = event.target as HTMLInputElement;
    let val = target.value;

    // Remove caracteres que não são dígitos, vírgula ou ponto
    val = val.replace(/[^\d,\.]/g, "");

    // Substitui vírgula por ponto para parseFloat
    val = val.replace(/,/g, ".");

    const num = parseFloat(val);

    if (!isNaN(num)) {
      this.internalValue = num;
      this.$emit("update:modelValue", num);
    } else {
      // Se não for número válido, zera
      this.internalValue = 0;
      this.$emit("update:modelValue", 0);
    }
  }

  onFocus() {
    this.isFocused = true;
  }

  onBlur() {
    this.isFocused = false;
    if (!this.internalValue || this.internalValue < 0) {
      this.internalValue = 0;
      this.$emit("update:modelValue", 0);
    }
  }

  formatCurrency(value: number | null | undefined): string {
    const val = typeof value === "number" && !isNaN(value) ? value : 0;
    return val.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }
}
</script>

<style>
.input-container {
  position: relative;
}

.input-currency {
  padding: 16px;
}

input {
  height: 48px;
  width: 100%;
  border: 1px solid #c0c0c0;
  border-radius: 4px;
  box-sizing: border-box;
  padding: 16px;
  font-size: 16px;
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
  color: grey;
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
  padding-left: 4px;
  padding-right: 4px;
}

input:focus + .label .text {
  color: var(--color-primary);
}
</style>
