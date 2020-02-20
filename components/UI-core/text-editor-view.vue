<template>
  <div class="ql-snow">
    <div class="ql-editor">
      <div v-html="value" />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class TextEditorVeiw extends Vue {
  @Prop({ type: String, required: true })
  private readonly value!: string

  // TODO санитайзинг
}
</script>

<style src="quill/dist/quill.snow.css" />
