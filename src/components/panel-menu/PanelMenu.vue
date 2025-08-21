<template>
  <div class="panel-menu">
    <ul>
      <li v-for="(parent, i) in items" :key="i" class="parent">
        <div
          class="parent-label"
          :class="{ selected: isSelected('parent', i) }"
          @click="
            selectItem('parent', i, parent);
            if (parent.children.length > 0) toggle(i);
          "
        >
          <span
            v-if="parent.children.length > 0"
            class="arrow"
            :class="{ open: isOpen(i) }"
            >❯</span
          >
          <span>{{ parent.label }}</span>
        </div>

        <transition name="slide">
          <ul v-show="isOpen(i)" class="children">
            <li
              v-for="(child, j) in parent.children"
              :key="j"
              class="child"
              :class="{ selected: isSelected('child', i, j) }"
              @click.stop="selectItem('child', i, child, j)"
            >
              {{ child.label }}
            </li>
          </ul>
        </transition>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-facing-decorator";

interface ChildItem {
  label: string;
}

interface ParentItem {
  label: string;
  children: ChildItem[];
}

type SelectedItem = {
  type: "parent" | "child";
  parentIndex: number;
  childIndex?: number;
} | null;

@Component({
  emits: ["itemSelecionado"],
})
export default class PanelMenu extends Vue {
  @Prop({ required: true, type: Array }) readonly items!: ParentItem[];

  openIndex: number | null = null;
  selectedItem: SelectedItem = null;

  toggle(index: number) {
    this.openIndex = this.openIndex === index ? null : index;
  }

  isOpen(index: number) {
    return this.openIndex === index;
  }

  selectItem(
    type: "parent" | "child",
    parentIndex: number,
    itemSelecionado: ChildItem,
    childIndex?: number
  ) {
    this.selectedItem = { type, parentIndex, childIndex };

    this.$emit("itemSelecionado", {
      data: itemSelecionado,
      info: this.selectedItem,
    });
  }

  isSelected(
    type: "parent" | "child",
    parentIndex: number,
    childIndex?: number
  ) {
    if (!this.selectedItem) return false;
    return (
      this.selectedItem.type === type &&
      this.selectedItem.parentIndex === parentIndex &&
      this.selectedItem.childIndex === childIndex
    );
  }
}
</script>

<style scoped>
.panel-menu {
  padding: 0.5rem;
  max-width: 280px;
}

ul {
  list-style-type: none;
  padding-left: 0;
  margin: 0;
}

.parent {
  margin-bottom: 0.25rem;
  border-radius: 0.4rem;
  background: #fafafa;
  border: 1px solid #e5e5e5;
  transition: background 0.2s;
}

.parent:hover {
  background: #f0f0f0;
}

.parent-label {
  font-weight: 500;
  padding: 0.6rem 0.8rem;
  display: flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
}

.arrow {
  font-size: 0.5rem;
  font-weight: 700;
  width: 1.1rem;
  display: inline-flex;
  justify-content: center;
  transition: transform 0.25s ease;
  color: var(--color-text);
}

.arrow.open {
  transform: rotate(90deg);
}

.children {
  background: #fff;
  padding: 0.6rem 0 0.6rem 0;
  border-top: 1px solid #eee;
}

.child {
  padding: 0.4rem 0 0.4rem 2.6rem;
  color: var(--color-text);
  font-size: 0.92rem;
  transition: color 0.2s, background 0.2s;
  cursor: pointer;
}

.child:hover {
  color: var(--color-primary);
}

.selected {
  background-color: #d0e7ff;
  color: var(--color-primary);
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.25s ease;
}
.slide-enter-from,
.slide-leave-to {
  max-height: 0;
  opacity: 0;
  transform: translateY(-3px);
}
.slide-enter-to,
.slide-leave-from {
  max-height: 300px;
  opacity: 1;
  transform: translateY(0);
}
</style>
