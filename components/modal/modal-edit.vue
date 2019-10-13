<template>
  <v-row justify="center">
    <v-dialog
      v-model="visible"
      fullscreen
      hide-overlay
      :persistent="updating"
      transition="dialog-bottom-transition"
      @keydown="escHandler"
    >
      <v-card>
        <v-toolbar dark color="primary">
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

        <v-card-text v-if="visible" class="pa-6">
          <v-form ref="form" :lazy-validation="true">
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

              <Time
                v-if="field.type === 'time'"
                :key="field.model"
                v-model.trim="localModel[field.model]"
                :label="field.label"
                :rules="Array.isArray(field.rules) ? field.rules : undefined"
              />
            </template>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import clonedeep from 'lodash.clonedeep'

export default {
  name: 'ModalEdit',
  components: {
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
      )
  },
  props: {
    /**
     * Редактируемая модель
     * @type {Object}
     */
    editModel: {
      type: Object,
      required: true
    },

    /**
     * Схема полей
     * @type {{ fields: Array }}
     */
    editSchema: {
      type: Object,
      required: true
    },

    /**
     * Флаг обновления
     * @type {Boolean}
     */
    updating: {
      type: Boolean,
      required: true
    },

    /**
     * Сигнализировать об изменениях модели
     * @type {Boolean}
     */
    watchModelChange: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    /**
     * Локальная копия модели на редактирование
     * @type {Object}
     */
    localModel: {},

    /**
     * Флаг показа модкльно окна
     * @type {String}
     */
    visible: false
  }),
  watch: {
    /**
     * Делаем локальную копию редактируемой сущности
     */
    editModel() {
      this.localModel = clonedeep(this.editModel)
    },

    /**
     * Отправляем наверх актуальные данные о редактируемой модели
     *
     */
    localModel: {
      deep: true,
      handler() {
        if (!this.watchModelChange) return

        this.$emit('modelChange', this.localModel)
      }
    }
  },
  mounted() {
    this.localModel = clonedeep(this.editModel)
  },
  methods: {
    /**
     * Открыть модально окно
     */
    open() {
      this.visible = true
    },

    /**
     * Закрыть модально окно
     */
    close() {
      this.visible = false
    },

    /**
     * Сохранение
     * @type {Function}
     */
    save() {
      this.editModel.id ? this.update() : this.create()
    },

    /**
     * Создать сущность
     * @type {Function}
     */
    create() {
      this.$emit('create', this.localModel)
    },

    /**
     * Обновить сущность
     * TODO: Доделать сравнение массивов
     * @type {Function}
     */
    update() {
      const data = { id: this.localModel.id }

      for (const key in this.localModel) {
        if (this.editModel[key] !== this.localModel[key])
          data[key] = this.localModel[key]
      }

      this.$emit('update', data)
    },

    /**
     * Обработчик нажатия на esc
     * @param {Object} event - объект события
     */
    escHandler(event) {
      if (event.code === 'Escape' && !this.updating) this.close()
    }
  }
}
</script>
