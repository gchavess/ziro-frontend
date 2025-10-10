<template>
  <div class="tree">
    <ul class="tree-root">
      <tree-node-mult-select
        v-for="node in treeData"
        :key="node.id"
        :node="node"
        @toggle="toggleNode"
        @select="selectNode"
        :selected-nodes="itensSelecionados"
      />
    </ul>
  </div>
</template>

<script lang="ts">
import TreeNodeMultSelect from "@/components/tree-mult-select/TreeNodeMultSelect.vue";
import { Component, Prop, Vue } from "vue-facing-decorator";

interface TreeNodeData {
  id: string | number;
  label: string;
  children?: TreeNodeData[];
  expanded?: boolean;
}

@Component({
  components: { TreeNodeMultSelect },
  emits: ["itensSelecionados"],
})
export default class TreeMultSelect extends Vue {
  @Prop({ required: true }) public treeData!: TreeNodeData[];

  public itensSelecionados: TreeNodeData[] = [];

  public toggleNode(node: TreeNodeData) {
    node.expanded = !node.expanded;
  }

  public selectNode(node: TreeNodeData) {
    const isSelected = this.itensSelecionados.some((n) => n.id === node.id);

    if (isSelected) {
      // remover nó e filhos
      this.removeNodeAndChildren(node);
    } else {
      // adicionar nó e filhos
      this.addNodeAndChildren(node);
    }

    this.$emit("itensSelecionados", this.itensSelecionados);
  }

  private addNodeAndChildren(node: TreeNodeData) {
    if (!this.itensSelecionados.some((n) => n.id === node.id)) {
      this.itensSelecionados.push(node);
    }

    if (node.children) {
      node.children.forEach((child) => this.addNodeAndChildren(child));
    }
  }

  private removeNodeAndChildren(node: TreeNodeData) {
    this.itensSelecionados = this.itensSelecionados.filter(
      (n) => n.id !== node.id
    );

    if (node.children) {
      node.children.forEach((child) => this.removeNodeAndChildren(child));
    }
  }
}
</script>

<style>
.tree {
  border: 1px solid #e0e0e0;
  border-radius: 4px;
}

.tree-root {
  list-style: none;
}

.tree-node-label {
  display: flex;
  align-items: center;
  padding: 0.5rem 0.75rem;
  font-weight: 500;
  transition: all 0.2s;
  cursor: pointer;
}

.tree-node-label:hover {
  background-color: #f0f4f8;
}

.tree-node-label.selected {
  position: relative;
  background-color: #e0e7ff;
}

.toggle-icon {
  display: inline-block;
  width: 1.25rem;
  text-align: center;
  transition: transform 0.2s;
  margin-right: 0.25rem;
}

.toggle-icon.expanded {
  transform: rotate(90deg);
}

.tree-root ul {
  margin-top: 0.25rem;
  padding-left: 1.25rem;
  border-left: 1px dashed #d1d5db;
}
</style>
