<template>
  <Card>
    <template v-slot:title>
      {{ $t('student.title') }}
    </template>

    <template v-slot:content>
      <v-text-field
        v-model="localStudent.full_name"
        :label="$t('field.fullName')"
        type="text"
        outlined
      />

      <v-text-field
        v-model="localStudent.email"
        label="Email"
        type="text"
        :rules="[$rules.email]"
        outlined
      />

      <v-text-field
        v-model="localStudent.phone"
        :label="$t('field.phone')"
        type="number"
        outlined
      />

      <v-text-field
        v-model="localStudent.about"
        :label="$t('field.about')"
        type="text"
        outlined
      />

      <v-text-field
        v-model="localStudent.social_networks.facebook"
        label="Facebook"
        type="text"
        outlined
      />

      <v-text-field
        v-model="localStudent.social_networks.twitter"
        label="Twitter"
        type="text"
        outlined
      />

      <v-select
        v-model="localStudent.locale"
        :items="locales"
        item-value="value"
        item-text="view"
        :label="$t('field.language')"
        outlined
      />

      <v-switch v-model="useDarkTheme" :label="$t('field.useDarkTheme')" />
    </template>

    <template v-slot:actions>
      <v-btn
        color="primary"
        :disabled="updating"
        @click="updateStudent(localStudent)"
        >{{ $t('actions.save') }}</v-btn
      >
    </template>
  </Card>
</template>

<script lang="ts">
import { Component, Mixins, Watch } from 'vue-property-decorator'
import clonedeep from 'lodash.clonedeep'
import CheckGroup from '~/mixins/CheckGroup.ts'
import { Student } from '~/api/group-users.ts'

interface localesOption {
  value: string
  view: string
}

@Component({
  components: {
    Card: () =>
      import(
        '~/components/UI-core/card.vue' /* webpackChunkName: 'components/UI-core/card' */
      )
  }
})
export default class StudentPage extends Mixins(CheckGroup) {
  /**
   * Локальнкая копия информации о студенте
   */
  localStudent: Student = {
    id: '',
    locale: '',
    about: '',
    created_at: '',
    email: '',
    full_name: '',
    phone: '',
    president: false,
    social_networks: {},
    updated_at: ''
  }

  locales: localesOption[] = [
    { view: 'English', value: 'en' },
    { view: 'Русский', value: 'ru' }
  ]

  /**
   * Флаг обновления
   */
  get updating() {
    return this.$vuexModules.User.updating
  }

  /**
   * Информация о студенте
   */
  get studentInfo(): Student {
    return this.$vuexModules.User.studentInfo
  }

  /**
   * Флаг использования темной темы
   */
  get useDarkTheme(): boolean {
    return this.$vuexModules.User.useDarkTheme
  }
  set useDarkTheme(value: boolean) {
    this.$vuexModules.User.SET_USE_DARK_THEME(value)
  }

  @Watch('studentInfo')
  onStudentInfoChange() {
    this.localStudent = clonedeep(this.studentInfo)
  }

  mounted() {
    this.localStudent = clonedeep(this.studentInfo)
  }

  /**
   * Обновить информацию о пользователе
   */
  updateStudent() {
    this.$vuexModules.User.updateStudent(this.localStudent)
  }
}
</script>
