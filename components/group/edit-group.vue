<template>
  <Loader v-if="loading" :show-form="true" :form-inputs-count="2" />

  <v-card v-else>
    <v-card-title>{{
      $t(`group.${localGroup.id ? 'update' : 'create'}`)
    }}</v-card-title>

    <v-card-text>
      <v-form ref="form" :lazy-validation="true">
        <v-text-field
          v-model="localGroup.title"
          :label="$t('field.title')"
          type="text"
          :rules="[$rules.required]"
          outlined
        />

        <v-text-field
          v-model="localGroup.number"
          :label="$t('field.number')"
          type="text"
          :rules="[$rules.required]"
          outlined
        />
      </v-form>
    </v-card-text>

    <v-card-actions>
      <v-btn color="primary" :disabled="updating" @click="save">{{
        $t('actions.save')
      }}</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { namespace, Types } from '~/store/group'

export default {
  name: 'CreateGroup',
  components: {
    Loader: () =>
      import(
        '~/components/UI-core/loader.vue' /* webpackChunkName: 'components/UI-core/loader' */
      )
  },
  props: {
    /**
     * Загружать ли данные при монтирование компонента
     * @type {Boolean}
     */
    loadInMounted: {
      type: Boolean,
      required: true
    }
  },
  data: () => ({
    /**
     * Группа
     * @type {Object}
     */
    localGroup: {
      id: '',
      title: '',
      group: ''
    }
  }),
  computed: {
    ...mapState(namespace, [
      /**
       * Флаг загрузки
       * @type {Boolean}
       */
      'loading',
      /**
       * Флаг обновления
       * @type {Boolean}
       */
      'updating',
      /**
       * Группа
       * @type {Object}
       */
      'group'
    ])
  },
  watch: {
    group() {
      this.localGroup = { ...this.group }
    }
  },
  mounted() {
    if (this.loadInMounted) this.loadGroup()
  },
  methods: {
    ...mapActions(namespace, {
      /**
       * Загрузить группу
       */
      loadGroup: Types.actions.GET_GROUP,
      /**
       * Создать группу
       */
      create: Types.actions.CREATE_GROUP,
      /**
       * Обновить ифнормацию о группе
       */
      update: Types.actions.UPDATE_GROUP
    }),

    /**
     * Сохранить группу
     */
    save() {
      if (!this.$refs.form.validate()) return

      this.localGroup.id
        ? this.update(this.localGroup)
        : this.create(this.localGroup)
    }
  }
}
</script>
