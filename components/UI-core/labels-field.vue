<template>
  <div>
    <div v-if="loading">
      loading...
    </div>

    <div>
      <v-select
        v-model="localValue"
        :items="labels"
        item-value="id"
        item-text="title"
        label="title"
        :rules="rules"
        :chips="true"
        :multiple="true"
        outlined
        attach
      >
        <template v-slot:selection="{ attrs, item, parent, selected }">
          <v-chip
            v-bind="attrs"
            :style="{
              background: item.color,
              color: item.text_color || 'black'
            }"
            :input-value="selected"
            label
            small
          >
            <span class="pr-2"> {{ item.title }} test </span>
          </v-chip>
        </template>
        <template v-slot:item="{ item }">
          <v-chip
            :style="{
              background: item.color,
              color: item.text_color || 'black'
            }"
            label
            small
          >
            {{ item.title }}
          </v-chip>
          <v-spacer></v-spacer>
          <v-list-item-action @click.stop>
            <v-btn icon @click.stop.prevent="edit(item.id)">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
          </v-list-item-action>
        </template>
      </v-select>
    </div>

    <v-dialog key="label" v-model="editing">
      <Card v-if="editingLabel">
        <template #content>
          <v-text-field
            v-model.trim="editingLabel.title"
            label="title"
            :rules="[$rules.required]"
            type="text"
            outlined
          />

          <v-text-field
            v-model.trim="editingLabel.description"
            label="description"
            type="text"
            outlined
          />

          <v-color-picker
            v-model="editingLabel.color"
            width="100%"
            hide-canvas
          ></v-color-picker>

          <v-color-picker
            v-model="editingLabel.text_color"
            width="100%"
            hide-canvas
          ></v-color-picker>
        </template>

        <template #actions>
          <v-btn text @click="editing = false">{{ $t('ui.cancel') }}</v-btn>

          <v-btn text @click="save">save</v-btn>
        </template>
      </Card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Model, Watch } from 'vue-property-decorator'
import { Label, labelApi } from '~/api/labels.ts'
import { Rule } from '~/plugins/rules.ts'

@Component({
  components: {
    Card: () =>
      import(
        '~/components/UI-core/card.vue' /* webpackChunkName: 'components/UI-core/card' */
      )
  }
})
export default class TagsField extends Vue {
  /**
   * Текущее значение
   * @type {string}
   */
  @Model('input', { type: Array as () => string[], default: () => [] })
  readonly value!: string[]

  /**
   * Правила валидации
   */
  @Prop({ type: Array as () => Rule[], default: () => [] })
  readonly rules!: Rule[]

  /**
   * Локальное значение с выбранными id тегов
   */
  localValue: string[] = []
  /**
   * Список всех тегов
   */
  labels: Label[] = []

  /**
   * Редактируемый тег
   */
  editingLabel: Label | null = null

  /**
   * Шаблон для нового тега
   */
  newLabelTemplate: Label = {
    title: '',
    description: '',
    color: '',
    text_color: ''
  }

  /**
   * Флаг загрузки
   */
  loading: boolean = true

  /**
   * Флаг редактирования
   */
  editing: boolean = false

  /**
   * При изменении локального значения выбранных тегов посылаем событие input для v-model
   */
  @Watch('localValue')
  onLocalValueChange() {
    this.$emit('input', this.localValue)
  }

  @Watch('editing')
  onEditingChange() {
    if (this.editing) return

    this.editingLabel = null
  }

  mounted() {
    this.localValue = [...this.value]
    this.loadData()
  }

  /**
   * Загрузить список всех тегов
   */
  async loadData() {
    try {
      this.labels = await labelApi.loadData()
      this.loading = false
    } catch (error) {
      this.$vuexModules.Snackbars.ADD_SNACKBARS(error.snackbarErrors)
    }
  }

  async create() {
    try {
      if (!this.editingLabel) return

      const label: Label = await labelApi.create(this.editingLabel)
      this.labels.push(label)
    } catch (error) {
      this.$vuexModules.Snackbars.ADD_SNACKBARS(error.snackbarErrors)
    }
  }

  edit(id: string) {
    const editingLabel = this.labels.find((item: Label) => item.id === id)
    if (!editingLabel) return
    if (!editingLabel.text_color) editingLabel.text_color = '#428BCA'

    this.editingLabel = { ...editingLabel }

    this.editing = true
    console.log(id)
  }

  save() {}
}
</script>
