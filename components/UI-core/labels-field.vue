<template>
  <div ref="select">
    <v-select
      v-model="localValue"
      :items="labels"
      append-icon="add"
      item-value="id"
      item-text="title"
      :loading="loading"
      :label="$t('field.tags')"
      :rules="rules"
      :chips="true"
      :multiple="true"
      :full-width="false"
      :menu-props="{
        bottom: true,
        offsetY: true,
        'z-index': 200,
        'max-width': fieldWidth + 'px'
      }"
      outlined
      @click:append="openEditingWindow()"
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
          <span class="pr-2"> {{ item.title }}</span>
        </v-chip>
      </template>
      <template v-slot:item="{ item }">
        <v-chip
          :style="{
            background: item.color,
            color: item.text_color || 'black'
          }"
          label
          :title="item.title"
          small
        >
          {{ item.title }}
        </v-chip>
        <v-spacer></v-spacer>
        <v-list-item-action @click.stop>
          <v-btn icon @click.stop.prevent="openEditingWindow(item.id)">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
        </v-list-item-action>
        <v-list-item-action @click.stop>
          <v-btn icon @click.stop.prevent="deleteLabel(item.id)">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </v-list-item-action>
      </template>
    </v-select>

    <v-dialog v-model="editing" content-class="tag__modal">
      <Card v-if="editingLabel">
        <template #title>
          {{ $t(`tags.${editingLabel.id ? 'edit' : 'addNew'}`) }}
        </template>

        <template #content>
          <v-text-field
            v-model.trim="editingLabel.title"
            :label="$t('field.title')"
            :rules="[$rules.required]"
            type="text"
            outlined
          />

          <v-text-field
            v-model.trim="editingLabel.description"
            :label="$t('field.description')"
            type="text"
            outlined
          />

          <div class="preview__wrapper">
            <span class="font-weight-bold text-center mr-5">Предпросмотр:</span>
            <v-chip
              v-if="editingLabel.title"
              :style="{
                background: editingLabel.color,
                color: editingLabel.text_color,
                maxWidth: '80%'
              }"
              :title="editingLabel.description"
              label
              small
            >
              <span class="pr-2"> {{ editingLabel.title }} </span>
            </v-chip>
          </div>

          <div class="color__wrapper">
            <div class="color__item">
              <div class="font-weight-bold text-center">Background</div>
              <v-color-picker v-model="editingLabel.color" />
            </div>

            <div class="color__item">
              <div class="font-weight-bold text-center">Text color</div>
              <v-color-picker v-model="editingLabel.text_color" />
            </div>
          </div>
        </template>

        <template #actions>
          <v-btn text :disabled="saving" @click="editing = false">{{
            $t('ui.close')
          }}</v-btn>

          <v-btn color="primary" :disabled="saving" @click="save">{{
            $t('actions.save')
          }}</v-btn>
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
   * Длина тега
   */
  fieldWidth: number = 0

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
    color: '#42a5f5',
    text_color: '#F9F3F3FF'
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
   * Флаг процесса сохранения
   */
  saving: boolean = false

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
    const select = this.$refs.select as HTMLElement
    this.fieldWidth = select.clientWidth
  }

  /**
   * Загрузить список всех тегов
   */
  async loadData() {
    try {
      const { data } = await labelApi.loadData()
      this.labels = data
      this.$vuexModules.Labels.SET_LABELS(data)
      this.loading = false
    } catch (error) {
      this.$vuexModules.Snackbars.ADD_SNACKBARS(error.snackbarErrors)
    }
  }

  /**
   * Открыть окно редактирования
   */
  openEditingWindow(id?: string) {
    const editingLabel = id
      ? this.labels.find((item: Label) => item.id === id)
      : { ...this.newLabelTemplate }

    if (!editingLabel) return

    this.editingLabel = { ...editingLabel }

    this.editing = true
  }

  /**
   * Сохранение
   */
  async save() {
    if (!this.editingLabel) return

    this.saving = true
    this.editingLabel.id ? await this.update() : await this.create()
    this.saving = false
  }

  /**
   * Обновить тег
   */
  async update() {
    try {
      if (!this.editingLabel || !this.editingLabel.id) return

      const updatedLabel = await labelApi.update(
        this.editingLabel,
        this.editingLabel.id
      )
      this.$vuexModules.Labels.SET_LABEL(updatedLabel)

      const oldLabel = this.labels.find(
        (item: Label) => item.id === updatedLabel.id
      )
      Object.assign(oldLabel, updatedLabel)
    } catch (error) {
      this.$vuexModules.Snackbars.ADD_SNACKBARS(error.snackbarErrors)
    }
  }

  /**
   * Создать новый тег
   */
  async create() {
    try {
      if (!this.editingLabel) return

      const label: Label = await labelApi.create(this.editingLabel)
      this.$vuexModules.Labels.SET_LABEL(label)
      this.labels.push(label)
      this.localValue.push(label.id as string)
    } catch (error) {
      this.$vuexModules.Snackbars.ADD_SNACKBARS(error.snackbarErrors)
    }
  }

  /**
   * Удалить тег
   */
  async deleteLabel(deletedId: string) {
    try {
      await labelApi.deleteById(deletedId)

      this.labels = this.labels.filter((label: Label) => label.id !== deletedId)
      if (this.localValue.includes(deletedId)) {
        this.localValue = this.localValue.filter(
          (id: String) => id !== deletedId
        )
      }
      this.$vuexModules.Labels.REMOVE_LABEL(deletedId)
    } catch (error) {
      this.$vuexModules.Snackbars.ADD_SNACKBARS(error.snackbarErrors)
    }
  }
}
</script>

<style>
.no-data__wrapper {
  padding: 15px;
}
@media (min-width: 900px) {
  .tag__modal {
    width: 70vw;
  }
}
</style>

<style scoped>
.color__wrapper {
  display: flex;
  justify-content: space-around;
}

.color__item {
  margin-bottom: 30px;
}

.preview__wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
}

@media (max-width: 900px) {
  .color__wrapper {
    flex-direction: column;
  }
}
</style>
