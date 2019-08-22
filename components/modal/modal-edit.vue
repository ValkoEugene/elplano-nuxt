<template>
  <v-row justify="center">
    <!-- eslint-disable -->
    <v-dialog :value="showingEdit" fullscreen hide-overlay transition="dialog-bottom-transition">
      <v-card>
        <v-toolbar dark color="primary">
          <v-btn icon dark @click="setShowing(false)">
            <v-icon>close</v-icon>
          </v-btn>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <!-- eslint-disable -->
            <v-btn
              dark
              text
              :disabled="updating"
              @click="$refs.form.validate() && save(localModel)"
            >{{ $t('actions.save') }}</v-btn>
          </v-toolbar-items>
        </v-toolbar>

        <v-card-text v-if="showingEdit" class="pa-6">
          <v-form ref="form" :lazy-validation="true">
            <template v-for="field in editSchema.fields">
              <v-text-field
                v-if="field.type === 'v-text-field'"
                v-model.trim="localModel[field.model]"
                :label="field.label"
                :placeholder="field.placeholder"
                :rules="Array.isArray(field.rules) ? field.rules : undefined"
                :type="field.inputType || 'text'"
                outlined
              />

              <v-select
                v-if="field.type === 'v-select'"
                v-model="localModel[field.model]"
                :items="field.items"
                :item-value="field.itemValue"
                :item-text="field.itemText"
                :label="field.label"
                outlined
                attach
                chips
                multiple
              />

              <Datepicker
                v-if="field.type === 'datepicker'"
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
import { mapState, mapMutations, mapActions } from 'vuex'
import {
  namespace as modalEditNamespace,
  Types as modalEditTypes
} from '../../store/modal/edit'

export default {
  name: 'ModalEdit',
  components: {
    Datepicker: () =>
      import(
        '../UI-core/datepicker.vue' /* webpackChunkName: 'components/UI-core/datepicker' */
      )
  },
  data: () => ({
    /**
     * Локальная копия модели на редактирование
     * @type {Object}
     */
    localModel: {}
  }),
  computed: {
    ...mapState(modalEditNamespace, [
      /**
       * Флаг показа модального окна
       * @type {Boolean}
       */
      'showingEdit',
      /**
       * Редактируемая модель
       * @type {Object}
       */
      'editModel',
      /**
       * Схема полей
       * @type {{ fields: Array }}
       */
      'editSchema',
      /**
       * namespace редактируемой сущности в модуле vuex
       */
      'editNamespace'
    ]),

    /**
     * Флаг обновления
     * @type {Boolean}
     */
    updating() {
      if (!this.editNamespace) return false

      return this.$store.state[this.editNamespace].updating
    }
  },
  watch: {
    /**
     * Делаем локальную копию редактируемой сущности
     */
    editModel() {
      this.localModel = clonedeep(this.editModel)
    }
  },
  methods: {
    ...mapMutations(modalEditNamespace, {
      /**
       * Установить флаг показа модального окна
       * @type {Function}
       */
      setShowing: modalEditTypes.mutations.SET_SHOWING_EDIT
    }),

    ...mapActions(modalEditNamespace, {
      /**
       * Сохранение
       * @type {Function}
       */
      save: modalEditTypes.actions.SAVE
    })
  }
}
</script>