<template>
  <div class="tree">
    <ul class="tree-root">
      <tree-node-mult-select
        v-for="node in localTreeData"
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
import { Component, Prop, Vue, Watch } from "vue-facing-decorator";

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

  public localTreeData: TreeNodeData[] = [];
  public itensSelecionados: TreeNodeData[] = [];

  created() {
    this.mergeTreeData(this.treeData);
  }

  @Watch("treeData")
  onWatcherTreeData() {
    this.mergeTreeData(this.treeData);
    this.itensSelecionados = [];
    this.emitirItensSelecionados();
  }

  private mergeTreeData(newData: TreeNodeData[]) {
    const preserveExpanded = (
      oldNode: TreeNodeData | undefined,
      newNode: TreeNodeData
    ) => {
      if (oldNode) {
        newNode.expanded = oldNode.expanded;
      }
      if (newNode.children) {
        newNode.children.forEach((child) => {
          const matchingOld = oldNode?.children?.find((c) => c.id === child.id);
          preserveExpanded(matchingOld, child);
        });
      }
    };

    newData.forEach((node) => {
      const oldNode = this.localTreeData.find((n) => n.id === node.id);
      preserveExpanded(oldNode, node);
    });

    this.localTreeData = newData;
  }

  public toggleNode(node: TreeNodeData) {
    node.expanded = !node.expanded;
  }

  public selectNode(node: TreeNodeData) {
    const isSelected = this.itensSelecionados.some((n) => n.id === node.id);

    if (isSelected) {
      this.removeNodeAndChildren(node);
    } else {
      this.addNodeAndChildren(node);
    }

    this.emitirItensSelecionados();
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

  private emitirItensSelecionados() {
    this.$emit("itensSelecionados", this.itensSelecionados);
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
