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

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import {
  getAboutInfo,
  updateSettings,
  AdminAbout as AdminAboutType
} from '~/api/admin.ts'
import { SnackbarsModule } from '~/store/snackbars.ts'

type FormText = {
  model: string
  label: string
  disabled?: boolean
  requried?: boolean
}

type FormTextarea = {
  model: string
  label: string
  textarea: true
  rows: number
  disabled?: boolean
  requried?: boolean
}

type AdminForm = [
  FormText,
  FormText,
  FormTextarea,
  FormTextarea,
  FormTextarea,
  FormText,
  FormText,
  FormText,
  FormText
]

@Component({
  components: {
    Loader: () =>
      import(
        '~/components/UI-core/loader.vue' /* webpackChunkName: 'components/UI-core/loader' */
      )
  }
})
export default class AdminAbout extends Vue {
  /**
   * Флаг загрузки
   * @type {Boolean}
   */
  loading: boolean = true

  /**
   * Флаг обновления данных
   * @type {Boolean}
   */
  updating: boolean = false

  /**
   * Информация о приложение
   * @type {Object}
   */
  about: AdminAboutType = {
    app_title: '',
    app_description: '',
    app_short_description: '',
    app_extended_description: '',
    app_terms: '',
    app_contact_email: '',
    app_contact_username: '',
    app_version: '',
    app_revision: ''
  }

  /**
   * Схема формы
   * @type {Array}
   */
  formSchema: AdminForm = [
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

  mounted() {
    this.loadData()
  }

  /**
   * Загрузить данные
   * @type {Function}
   */
  async loadData(): Promise<void> {
    try {
      this.about = await getAboutInfo()
      this.loading = false
    } catch (error) {
      SnackbarsModule.ADD_SNACKBARS(error.snackbarErrors)
    }
  }

  /**
   * Обновить данные
   * @type {Function}
   */
  async update(data: AdminAboutType): Promise<void> {
    try {
      this.updating = true
      await updateSettings(data)
    } catch (error) {
      SnackbarsModule.ADD_SNACKBARS(error.snackbarErrors)
    } finally {
      this.updating = false
    }
  }
}
</script>
