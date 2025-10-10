<template>
  <div class="upload-wrapper">
    <button
      type="button"
      class="upload-button"
      @click="triggerFileInput"
      v-if="!fileName"
    >
      Escolher arquivo
    </button>

    <div class="file-selected" v-else>
      <span class="file-name">{{ fileName }}</span>
      <button type="button" class="remove-file" @click="removeFile">×</button>
    </div>

    <input
      type="file"
      ref="fileInput"
      :accept="accept"
      @change="onFileChange"
      class="upload-input"
    />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-facing-decorator";

@Component
export default class ButtonUpload extends Vue {
  @Prop({ type: String, default: ".csv,.xlsx" })
  public accept!: string;

  public fileName: string = "";

  triggerFileInput() {
    (this.$refs.fileInput as HTMLInputElement).click();
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.fileName = input.files[0].name;
      this.$emit("arquivo", input.files[0]);
    }
  }

  removeFile() {
    this.fileName = "";
    const input = this.$refs.fileInput as HTMLInputElement;
    input.value = "";
    this.$emit("arquivoRemovido");
  }
}
</script>

<style scoped>
.upload-wrapper {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.upload-input {
  display: none;
}

.upload-button {
  padding: 8px 16px;
  cursor: pointer;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #f5f5f5;
}

.file-selected {
  display: inline-flex;
  align-items: center;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 4px 8px;
  background-color: #f5f5f5;
}

.file-name {
  margin-right: 8px;
}

.remove-file {
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 16px;
  line-height: 1;
}
</style>
