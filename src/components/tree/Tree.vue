<template>
  <div class="tree">
    <ul class="tree-root">
      <tree-node
        v-for="node in treeData"
        :key="node.id"
        :node="node"
        @toggle="toggleNode"
        @select="selectNode"
        :selected-node="itemSelecionado"
      />
    </ul>
  </div>
</template>

<script lang="ts">
import TreeNode from "@/components/tree/TreeNode.vue";
import { Component, Prop, Vue, Watch } from "vue-facing-decorator";

interface TreeNodeData {
  id: string | number;
  label: string;
  children?: TreeNodeData[];
  expanded?: boolean;
}

@Component({
  components: { TreeNode },
  emits: ["itemSelecionado"],
})
export default class Tree extends Vue {
  @Prop({ required: true }) public treeData!: TreeNodeData[];

  public itemSelecionado: TreeNodeData | null = null;

  private expandedNodeIds: (string | number)[] = [];
  private selectedNodeId: string | number | null = null;

  mounted() {
    this.saveState();
  }

  // Observa mudanças da prop treeData
  @Watch("treeData", { deep: true, immediate: true })
  onTreeDataChanged() {
    this.setExpandedNodes(this.treeData, this.expandedNodeIds);
    if (this.selectedNodeId != null) {
      this.itemSelecionado = this.findNodeById(
        this.treeData,
        this.selectedNodeId
      );
    }
  }

  public toggleNode(node: TreeNodeData) {
    node.expanded = !node.expanded;
    this.saveState();
  }

  public selectNode(node: TreeNodeData) {
    this.itemSelecionado = node;
    this.selectedNodeId = node.id;
    this.$emit("itemSelecionado", this.itemSelecionado);
  }

  private saveState() {
    this.expandedNodeIds = this.getExpandedNodes(this.treeData);
    this.selectedNodeId = this.itemSelecionado?.id ?? null;
  }

  private getExpandedNodes(nodes: TreeNodeData[]): (string | number)[] {
    let result: (string | number)[] = [];
    for (const node of nodes) {
      if (node.expanded) result.push(node.id);
      if (node.children)
        result = result.concat(this.getExpandedNodes(node.children));
    }
    return result;
  }

  private setExpandedNodes(
    nodes: TreeNodeData[],
    expandedNodes: (string | number)[]
  ) {
    for (const node of nodes) {
      node.expanded = expandedNodes.includes(node.id);
      if (node.children) this.setExpandedNodes(node.children, expandedNodes);
    }
  }

  private findNodeById(
    nodes: TreeNodeData[],
    id: string | number
  ): TreeNodeData | null {
    for (const node of nodes) {
      if (node.id === id) return node;
      if (node.children) {
        const found = this.findNodeById(node.children, id);
        if (found) return found;
      }
    }
    return null;
  }
}
</script>

<style>
.tree {
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  height: 100%;
  overflow: auto;
  width: 300px;
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
  background-color: var(--color-primary-bg);
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
