<template>
  <li>
    <div class="option" @click.stop="selectOption(option)">
      {{ option.label }}
    </div>
    <ul v-if="option.children">
      <option-item
        v-for="child in option.children"
        :key="child.value || child.label"
        :option="child"
        @select="$emit('select', $event)"
      />
    </ul>
  </li>
</template>

<script lang="ts">
import { OptionDTO } from "@/interface/option/OptionDTO";
import { Component, Prop, Vue } from "vue-facing-decorator";

@Component
export default class OptionItem extends Vue {
  @Prop({ type: Object, required: true }) option!: OptionDTO;

  selectOption(option: OptionDTO) {
    this.$emit("select", option);
  }
}
</script>

<style scoped>
.dropdown {
  list-style: none;
  margin: 0;
  padding: 0;
  border: 1px solid #c0c0c0;
  max-height: 300px;
  overflow-y: auto;
  position: absolute;
  width: 100%;
  background-color: white;
  z-index: 1000;
}

.option {
  padding: 8px 16px;
  cursor: pointer;
}

.option:hover {
  background-color: #f0f0f0;
}

ul ul {
  padding-left: 16px;
}
</style>
