<template>
  <div class="switch-container">
    <label class="switch">
      <input type="checkbox" :checked="modelValue" @change="toggle" />
      <span class="slider"></span>
    </label>
    <span v-if="label" class="switch-label">{{ label }}</span>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-facing-decorator";

@Component({
  emits: ["update:modelValue"],
})
export default class Switch extends Vue {
  @Prop({ type: Boolean, default: false }) modelValue!: boolean;
  @Prop({ type: String, default: "" }) label!: string;

  toggle() {
    this.$emit("update:modelValue", !this.modelValue);
  }
}
</script>

<style>
.switch-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 26px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: 0.4s;
  border-radius: 26px;
}

.slider::before {
  position: absolute;
  content: "";
  height: 22px;
  width: 22px;
  left: 2px;
  bottom: 2px;
  background-color: white;
  transition: 0.4s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: var(--color-primary);
}

input:checked + .slider::before {
  transform: translateX(24px);
}

.switch-label {
  font-size: 14px;
  color: #333;
}
</style>
