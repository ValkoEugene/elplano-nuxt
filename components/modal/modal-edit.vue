<template>
  <v-row justify="center">
    <v-dialog
      v-model="visible"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
      @keydown="escHandler"
    >
      <v-card>
        <v-toolbar dark color="primary">
          <v-btn icon dark @click="close">
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
        '../UI-core/datepicker.vue' /* webpackChunkName: 'components/UI-core/datepicker' */
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
     * namespace модуля редактируемой сущности
     * @type {String}
     */
    namespace: {
      type: String,
      required: true
    },

    /**
     * Action на обновление
     * @type {String}
     */
    updateAction: {
      type: String,
      required: true
    },

    /**
     * Action на создание
     * @type {String}
     */
    createAction: {
      type: String,
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
  computed: {
    /**
     * Флаг обновления
     * @type {Boolean}
     */
    updating() {
      if (!this.namespace) return false

      return this.$store.state[this.namespace].updating
    },

    /**
     * Id редактируемой сущности
     * @type {String}
     */
    id() {
      if (!this.namespace) return ''

      return this.$store.state[this.namespace].editingId
    }
  },
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
      const saveAction = this.id ? this.updateAction : this.createAction

      this.$store.dispatch(`${this.namespace}/${saveAction}`, this.localModel)
    },

    /**
     * Обработчик нажатия на esc
     * @param {Object} event - объект события
     */
    escHandler(event) {
      if (event.code === 'Escape') this.close()
    }
  }
}
</script>
