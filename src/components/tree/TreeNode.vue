<template>
  <li class="tree-node">
    <div
      class="tree-node-label"
      :class="{ selected: node === selectedNode }"
      @click.stop="handleSelect"
    >
      <span
        class="toggle-icon"
        :class="{ expanded: node.expanded }"
        v-if="hasChildren"
        @click.stop="handleToggle"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="icon"
          viewBox="0 0 24 24"
          :class="{ rotated: node.expanded }"
        >
          <path :d="mdiChevronRight" />
        </svg>
      </span>

      <span v-else class="toggle-icon"></span>

      <div v-if="selectedNode?.id === node?.id" class="fullrow"></div>

      <div class="tree-label">{{ node.label }}</div>

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
        :selected-node="selectedNode"
      />
    </ul>
  </li>
</template>

<script lang="ts">
import Chip from "@/components/chip/Chip.vue";
import { mdiChevronRight } from "@mdi/js";
import { Component, Prop, Vue } from "vue-facing-decorator";

@Component({
  components: { Chip },
})
export default class TreeNode extends Vue {
  @Prop({ required: true }) node!: any;
  @Prop() selectedNode: any;

  public mdiChevronRight = mdiChevronRight;

  get hasChildren() {
    return this.node.children && this.node.children.length > 0;
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
.fullrow {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: rgba(0, 123, 255, 0.1);
  z-index: -1;
}

.tree-label {
  margin-right: 6px;
  white-space: nowrap;
}
</style>
