<template>
  <Loader
    v-if="loading"
    :show-form="true"
    :form-inputs-count="8"
    class="mb-6"
  />

  <v-form v-else ref="form" :lazy-validation="true">
    <template v-for="item in formSchema">
      <v-textarea
        v-if="item.textarea"
        :key="item.model"
        v-model.trim="about[item.model]"
        :label="item.label"
        :rules="item.requried ? [$rules.required] : []"
        :rows="item.rows"
        :disabled="item.disabled"
        outlined
      />

      <v-text-field
        v-else
        :key="item.model"
        v-model.trim="about[item.model]"
        :label="item.label"
        :rules="item.requried ? [$rules.required] : []"
        :disabled="item.disabled"
        outlined
      />
    </template>

    <v-btn
      color="primary"
      :disabled="updating"
      @click="$refs.form.validate() && update(about)"
      >Save</v-btn
    >
  </v-form>
</template>

<script>
import { getAboutInfo, updateSettings } from '../../api/admin'
import { addSnackbarsByStore } from '../../store/snackbars'

export default {
  name: 'AdminAbout',
  components: {
    Loader: () =>
      import(
        '../UI-core/loader.vue' /* webpackChunkName: 'components/UI-core/loader' */
      )
  },
  data: () => ({
    /**
     * Флаг загрузки
     * @type {Boolean}
     */
    loading: true,

    /**
     * Флаг обновления данных
     * @type {Boolean}
     */
    updating: false,

    /**
     * Информация о приложение
     * @type {Object}
     */
    about: {
      app_title: null,
      app_description: null,
      app_short_description: null,
      app_extended_description: null,
      app_terms: null,
      app_contact_email: null,
      app_contact_username: null,
      app_version: null,
      app_revision: null
    },

    /**
     * Схема формы
     * @type {Array}
     */
    formSchema: [
      {
        model: 'app_title',
        label: 'Application title'
      },
      {
        model: 'app_description',
        label: 'Application description'
      },
      {
        model: 'app_short_description',
        label: 'Application short description',
        textarea: true,
        rows: 4
      },
      {
        model: 'app_extended_description',
        label: 'Extended description',
        textarea: true,
        rows: 8
      },
      {
        model: 'app_terms',
        label: 'Application terms',
        textarea: true,
        rows: 8
      },
      {
        model: 'app_contact_email',
        label: 'Contact person’s email',
        requried: true
      },
      {
        model: 'app_contact_username',
        label: 'Contact person’s name',
        requried: true
      },
      {
        model: 'app_revision',
        label: 'Application revision',
        disabled: true
      },
      {
        model: 'app_version',
        label: 'Application version',
        disabled: true
      }
    ]
  }),
  mounted() {
    this.loadData()
  },
  methods: {
    /**
     * Загрузить данные
     * @type {Function}
     */
    async loadData() {
      try {
        this.about = await getAboutInfo()
        this.loading = false
      } catch (error) {
        addSnackbarsByStore(this.$store, error.snackbarErrors)
      }
    },

    /**
     * Обновить данные
     * @type {Function}
     */
    async update(data) {
      try {
        this.updating = true
        await updateSettings(data)
      } catch (error) {
        addSnackbarsByStore(this.$store, error.snackbarErrors)
      } finally {
        this.updating = false
      }
    }
  }
}
</script>
