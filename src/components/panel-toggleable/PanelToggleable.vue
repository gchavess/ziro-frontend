<template>
  <div style="border: 1px solid #e2e2e2; border-radius: 4px">
    <div
      @click="toggle"
      style="padding: 1rem"
      :style="aberto ? 'border-bottom: 1px solid #e2e2e2' : ''"
    >
      <slot name="header" />

      <i :class="aberto ? 'fas fa-minus-circle' : 'fas fa-plus-circle'"></i>
    </div>
    <transition name="fade">
      <div v-if="aberto" style="padding: 1rem">
        <slot name="content" />
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-facing-decorator";

@Component({
  emits: ["toggle"],
})
export default class PanelToggleable extends Vue {
  @Prop({ type: Boolean, default: false })
  public aberto = false;

  public toggle() {
    this.$emit("toggle");
  }
}
</script>

<style scoped></style>
