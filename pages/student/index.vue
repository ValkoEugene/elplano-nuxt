<template>
  <Card>
    <template v-slot:title>
      {{ $t('student.title') }}
    </template>

    <template v-slot:content>
      <v-form ref="form" :lazy-validation="true">
        <div
          :class="[
            $nuxt.$vuetify.breakpoint.lgAndUp
              ? 'student-fields__wrapper--large'
              : ''
          ]"
        >
          <div class="student-fields__main">
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

            <SocialNetworksField
              v-if="!$nuxt.$vuetify.breakpoint.lgAndUp"
              v-model="localStudent.social_networks"
              class="student-fields__social-networks"
            />

            <v-select
              v-model="localStudent.locale"
              :items="locales"
              item-value="value"
              item-text="view"
              :label="$t('field.language')"
              outlined
            />

            <v-switch
              v-model="useDarkTheme"
              :label="$t('field.useDarkTheme')"
            />
          </div>

          <SocialNetworksField
            v-if="$nuxt.$vuetify.breakpoint.lgAndUp"
            v-model="localStudent.social_networks"
            class="student-fields__social-networks"
          />
        </div>
      </v-form>
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
import { computed, ref, defineComponent, watch } from '@vue/composition-api'
import clonedeep from 'lodash.clonedeep'
import { Student } from '~/api/group-users.ts'

interface localesOption {
  value: string
  view: string
}

interface Form {
  validate: () => boolean
}

const components = {
  Card: () =>
    import(
      '~/components/UI-core/card.vue' /* webpackChunkName: 'components/UI-core/card' */
    ),
  SocialNetworksField: () =>
    import(
      '~/components/UI-core/fields/social-networks.vue' /* webpackChunkName: 'components/UI-core/fields/social-networks' */
    )
}

export default defineComponent({
  name: 'StudentPage',
  components,
  setup(_, context) {
    const { $vuexModules } = context.root

    /** Ссылка на компонент формы из vuetify */
    const form = ref<Form>(null)

    /** Информация о студенте */
    const studentInfo = computed(() => $vuexModules.User.studentInfo)

    /** Локальнкая копия информации о студенте */
    const localStudent = ref<Student>(clonedeep(studentInfo))

    /** Список доступных локалей */
    const locales: localesOption[] = [
      { view: 'English', value: 'en' },
      { view: 'Русский', value: 'ru' }
    ]

    /** Флаг обновления */
    const updating = computed(() => $vuexModules.User.updating)

    /** Флаг использования темной темы */
    const useDarkTheme = computed({
      get: () => $vuexModules.User.useDarkTheme,
      set: (value: boolean) => $vuexModules.User.SET_USE_DARK_THEME(value)
    })

    /** Актуализируем локальную копию информации о студенте */
    watch(studentInfo, (studentInfo) => {
      localStudent.value = clonedeep(studentInfo)
    })

    /** Обновить информацию о пользователе */
    const updateStudent = () => {
      if (form.value && !form.value.validate()) return

      $vuexModules.User.updateStudent(localStudent.value)
    }

    return {
      localStudent,
      locales,
      updating,
      useDarkTheme,
      updateStudent,
      form
    }
  }
})
</script>

<style>
.student-fields__wrapper--large {
  display: flex;
  flex-direction: column;
  flex-flow: wrap;
  justify-content: space-between;
}

.student__fields--large > div {
  max-width: 50%;
}

.student-fields__wrapper--large .student-fields__main,
.student-fields__wrapper--large .student-fields__social-networks {
  width: 48%;
}
</style>
