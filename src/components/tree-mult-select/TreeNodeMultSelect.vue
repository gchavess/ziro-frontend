<template>
  <li class="tree-node">
    <div
      class="tree-node-label"
      @click="handleSelect"
      :class="{ selected: isSelected }"
    >
      <span
        class="toggle-icon"
        :class="{ expanded: node.expanded }"
        v-if="hasChildren"
        @click.stop="handleToggle"
      >
        ▶
      </span>

      <span v-else class="toggle-icon"></span>

      <input type="checkbox" :checked="isSelected" class="tree-checkbox" />

      <span class="tree-label">{{ node.label }}</span>

      <chip
        v-if="node?.natureza?.descricao"
        :label="node?.natureza?.descricao"
      />
    </div>

    <ul v-show="node.expanded" v-if="hasChildren" class="pl-4">
      <tree-node
        v-for="child in node.children"
        :key="child.id"
        :node="child"
        @toggle="$emit('toggle', $event)"
        @select="$emit('select', $event)"
        :selected-nodes="selectedNodes"
      />
    </ul>
  </li>
</template>

<script lang="ts">
import Chip from "@/components/chip/Chip.vue";
import { Component, Prop, Vue } from "vue-facing-decorator";

@Component({
  components: {
    Chip,
  },
})
export default class TreeNode extends Vue {
  @Prop({ required: true }) node!: any;
  @Prop({ required: true }) selectedNodes!: any[];

  get hasChildren() {
    return this.node.children && this.node.children.length > 0;
  }

  get isSelected() {
    return this.selectedNodes.some((n) => n.id === this.node.id);
  }

  handleToggle() {
    this.$emit("toggle", this.node);
  }

  handleSelect() {
    this.$emit("select", this.node);
  }
}
</script>

<style>
.tree-checkbox {
  margin-right: 0.5rem;
  width: 1rem;
  height: 1rem;
}

.tree-label {
  flex: 1;
}
</style>
