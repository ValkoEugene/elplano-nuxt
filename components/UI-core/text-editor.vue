<template>
  <vue-editor
    v-model="localValue"
    :editor-toolbar="customToolbar"
    class="custom-text-editor "
  />
</template>

<script lang="ts">
import { VueEditor } from 'vue2-editor'
import { Vue, Component, Model, Watch } from 'vue-property-decorator'
import throttle from '~/utils/throttle'

@Component({
  components: {
    VueEditor
  }
})
export default class TextEditor extends Vue {
  /**
   * Значение для v-model
   */
  @Model('input', { type: String }) private readonly value!: string
  customToolbar = [
    ['bold', 'italic', 'underline', 'strike'], // toggled buttons
    ['blockquote', 'code-block'],

    [{ header: 1 }, { header: 2 }], // custom button values
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
    [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
    [{ direction: 'rtl' }], // text direction

    [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
    [{ header: [1, 2, 3, 4, 5, 6, false] }],

    [{ color: [] }, { background: [] }], // dropdown with defaults from theme
    // [{ font: [] }],
    [{ align: [] }],

    ['clean']
  ]

  /**
   * Локальная копия значения
   */
  localValue: string = ''

  /**
   * Функция для обновления значения с задержкой
   * @type {Functoin}
   */
  get throttleEmitValue(): (value: string) => void {
    return throttle(this.emitValue, 300)
  }

  /**
   * Обновляем значение для v-model
   * @type {Function}
   */
  emitValue(): void {
    this.$emit('input', this.localValue)
  }

  /**
   * Инициализация значения
   */
  mounted() {
    this.localValue = this.value
  }

  /**
   * Следим за изменением локального значения
   * @param {string} val - новое локальное значение
   */
  @Watch('localValue')
  onLocalValueChange(val: string) {
    this.throttleEmitValue(val)
  }
}
</script>

<style>
.custom-text-editor .tui-editor-defaultUI {
  border-color: #aeaeae;
}

.custom-text-editor .ql-toolbar.ql-snow {
  border: 1px solid #aeaeae;
  border-radius: 4px 4px 0 0;
}

.custom-text-editor .ql-container.ql-snow {
  border: 1px solid #aeaeae;
  border-radius: 0 0 4px 4px;
}
</style>
