<template>
  <div>
    <v-overlay :value="visible" z-index="99" />
    <transition name="modal">
      <v-card v-if="visible" class="modal-edit">
        <v-toolbar class="bg-primary-lighten1">
          <v-btn icon dark :disabled="updating" @click="close">
            <v-icon>close</v-icon>
          </v-btn>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn
              dark
              text
              :disabled="updating"
              @click="$refs.form.validate() && save(localModel)"
              >{{ $t('actions.save') }}</v-btn
            >
          </v-toolbar-items>
        </v-toolbar>

        <v-card-text v-if="visible" class="pa-6 card-edit__content">
          <v-form
            v-if="!$scopedSlots.content"
            ref="form"
            :lazy-validation="true"
          >
            <template v-for="field in editSchema.fields">
              <v-text-field
                v-if="field.type === 'v-text-field'"
                :key="field.model"
                v-model.trim="localModel[field.model]"
                :label="field.label"
                :rules="Array.isArray(field.rules) ? field.rules : undefined"
                :type="field.inputType || 'text'"
                outlined
              />

              <v-textarea
                v-if="field.type === 'v-textarea-field'"
                :key="field.model"
                v-model.trim="localModel[field.model]"
                :label="field.label"
                :rules="Array.isArray(field.rules) ? field.rules : undefined"
                :rows="field.rows || 4"
                outlined
              />

              <labels-field
                v-if="field.type === 'tags'"
                :key="field.model"
                v-model.trim="localModel[field.model]"
              />

              <v-select
                v-if="field.type === 'v-select'"
                :key="field.model"
                v-model="localModel[field.model]"
                :items="field.items"
                :item-value="field.itemValue"
                :item-text="field.itemText"
                :label="field.label"
                :rules="Array.isArray(field.rules) ? field.rules : undefined"
                :chips="field.multiple"
                :multiple="field.multiple"
                :menu-props="field.menuProps"
                outlined
                attach
              />

              <v-checkbox
                v-if="field.type === 'v-checkbox'"
                :key="field.model"
                v-model="localModel[field.model]"
                :label="field.label"
                :rules="Array.isArray(field.rules) ? field.rules : undefined"
                color="primary"
                class="mt-0"
              />

              <v-switch
                v-if="field.type === 'v-switch'"
                :key="field.model"
                v-model="localModel[field.model]"
                :label="field.label"
                color="primary"
              />

              <v-radio-group
                v-if="field.type === 'v-radio-group'"
                :key="field.model"
                v-model="localModel[field.model]"
                :row="field.row"
              >
                <v-radio
                  v-for="option in field.options"
                  :key="option.value"
                  :label="option.label"
                  :value="option.value"
                />
              </v-radio-group>

              <Datepicker
                v-if="field.type === 'datepicker'"
                :key="field.model"
                v-model="localModel[field.model]"
                :label="field.label"
                :rules="Array.isArray(field.rules) ? field.rules : undefined"
              />

              <Date
                v-if="field.type === 'date'"
                :key="field.model"
                v-model.trim="localModel[field.model]"
                :label="field.label"
                :rules="Array.isArray(field.rules) ? field.rules : undefined"
              />

              <TextEditor
                v-if="field.type === 'text-editor'"
                :key="field.model"
                v-model="localModel[field.model]"
              />

              <Time
                v-if="field.type === 'time'"
                :key="field.model"
                v-model.trim="localModel[field.model]"
                :label="field.label"
                :rules="Array.isArray(field.rules) ? field.rules : undefined"
              />

              <ReadonlyTextField
                v-if="field.type === 'readonly-text'"
                :key="field.model"
                :label="field.label"
                :value="localModel[field.model]"
              />
            </template>
          </v-form>

          <slot name="content" />
        </v-card-text>
      </v-card>
    </transition>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import clonedeep from 'lodash.clonedeep'

@Component({
  components: {
    ReadonlyTextField: () =>
      import(
        '~/components/UI-core/readonly-text-field.vue' /* webpackChunkName: 'components/UI-core/readonly-text-field' */
      ),
    LabelsField: () =>
      import(
        '~/components/UI-core/labels-field.vue' /* webpackChunkName: 'components/UI-core/labels-field' */
      ),
    Datepicker: () =>
      import(
        '~/components/UI-core/datepicker.vue' /* webpackChunkName: 'components/UI-core/datepicker' */
      ),
    Date: () =>
      import(
        '~/components/UI-core/date.vue' /* webpackChunkName: 'components/UI-core/date' */
      ),
    Time: () =>
      import(
        '~/components/UI-core/time.vue' /* webpackChunkName: 'components/UI-core/time' */
      ),
    TextEditor: () =>
      import(
        '~/components/UI-core/text-editor.vue' /* webpackChunkName: 'components/UI-core/text-editor' */
      )
  }
})
export default class ModalEdit extends Vue {
  /**
   * Редактируемая модель
   * @type {{ [key: string]: any }}
   */
  @Prop({ type: Object as () => { [key: string]: any }, required: true })
  readonly editModel!: { [key: string]: any }

  /**
   * Схема полей
   * TODO интерфейсы для схемы
   * @type {{ fields: Array }}
   */
  @Prop({ type: Object as () => { fields: any[] }, required: true })
  readonly editSchema!: { fields: any[] }

  /**
   * Флаг обновления
   * @type {boolean}
   */
  @Prop({ type: Boolean, required: true })
  readonly updating!: boolean

  /**
   * Сигнализировать об изменениях модели
   * @type {boolean}
   */
  @Prop({ type: Boolean, default: false })
  readonly watchModelChange!: boolean

  /**
   * Посылать наверх только измененные данные модели
   */
  @Prop({ type: Boolean, default: true })
  readonly emitOnlyChangedData: boolean

  /**
   * Локальная копия модели на редактирование
   * @type {{ [key: string]: any }}
   */
  localModel: { [key: string]: any } = {}

  /**
   * Флаг показа модального окна
   * @type {boolean}
   */
  visible: boolean = false

  /**
   * Открыть модальное окно
   */
  open() {
    this.visible = true
  }

  /**
   * Закрыть модально окно
   */
  close() {
    this.visible = false
  }

  /**
   * Сохранение
   * @type {Function}
   */
  save() {
    this.editModel.id ? this.update() : this.create()
  }

  /**
   * Создать сущность
   * @type {Function}
   */
  create() {
    this.$emit('create', this.localModel)
  }

  /**
   * Обновить сущность
   * TODO: Доделать сравнение массивов
   * @type {Function}
   */
  update() {
    if (!this.emitOnlyChangedData) return this.$emit('update', this.localModel)

    const data: { [key: string]: any } = { id: this.localModel.id }

    for (const key in this.localModel) {
      if (this.editModel[key] !== this.localModel[key])
        data[key] = this.localModel[key]
    }

    this.$emit('update', data)
  }

  /**
   * Обработчик нажатия на esc
   * @param {KeyboardEvent} event - объект события
   */
  escHandler(event: KeyboardEvent) {
    if (event.code === 'Escape' && !this.updating) this.close()
  }

  mounted() {
    this.localModel = clonedeep(this.editModel)
  }

  /**
   * Делаем локальную копию редактируемой сущности
   */
  @Watch('editModel')
  onEditModelChange() {
    this.localModel = clonedeep(this.editModel)
  }

  /**
   * Отправляем наверх актуальные данные о редактируемой модели
   */
  @Watch('localModel', { deep: true })
  onLocalModelChange() {
    if (!this.watchModelChange) return

    this.$emit('modelChange', this.localModel)
  }
}
</script>

<style>
.modal-edit {
  position: fixed;
  right: 0;
  top: 0;
  z-index: 100;
  width: 35vw;
  height: 100vh;
}

.card-edit__content {
  max-height: calc(100vh - 64px);
  overflow: auto;
  height: 100%;
}

.modal-enter-active,
.modal-leave-active {
  transition: 0.3s;
}
.modal-enter,
.modal-leave-to {
  transform: translateX(100%);
}

.mobile .modal-edit {
  width: 100vw;
}
</style>
