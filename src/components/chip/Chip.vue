<template>
  <span
    class="chip"
    :class="[`chip--${color}`, { 'chip--clickable': clickable }]"
    @click="onClick"
  >
    <i v-if="icon" :class="['chip__icon', icon]" />
    <span class="chip__label">{{ label }}</span>
    <button v-if="closable" class="chip__close" @click.stop="onClose">✕</button>
  </span>
</template>

<script lang="ts">
import { ChipColor } from "@/enums/ChipColor";
import { Component, Prop, Vue } from "vue-facing-decorator";

@Component({
  emits: ["close", "click"],
})
export default class Chip extends Vue {
  @Prop({ type: String, required: true }) label!: string;
  @Prop({ type: String, default: "" }) icon!: string;
  @Prop({ type: Boolean, default: false }) closable!: boolean;
  @Prop({ type: Boolean, default: false }) clickable!: boolean;
  @Prop({ type: String, default: ChipColor.DEFAULT }) color!: ChipColor;

  onClose() {
    this.$emit("close");
  }

  onClick() {
    this.$emit("click");
  }
}
</script>

<style scoped>
.chip {
  display: inline-flex;
  align-items: center;
  border-radius: 9999px;
  padding: 0.25rem 0.75rem;
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1;
  cursor: default;
  user-select: none;
  background-color: #e2e2e2;
  color: #333;
}

.chip--clickable {
  cursor: pointer;
  transition: background 0.2s;
}
.chip--clickable:hover {
  background-color: #e0e0e0;
}

.chip__icon {
  margin-right: 0.4rem;
  font-size: 1rem;
}

.chip__label {
  white-space: nowrap;
}

.chip__close {
  margin-left: 0.4rem;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 0.9rem;
  line-height: 1;
}

.chip--primary {
  background-color: var(--color-primary);
  color: white;
}

.chip--success {
  background-color: #28a745;
  color: white;
}

.chip--danger {
  background-color: #dc3545;
  color: white;
}
</style>
