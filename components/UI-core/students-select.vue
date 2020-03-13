<template>
  <v-select
    :value="value"
    :items="students"
    item-value="id"
    :item-text="(item) => item.full_name || item.email"
    :label="$t('field.students')"
    :rules="[$rules.required]"
    :chips="true"
    :multiple="true"
    outlined
    attach
    @input="$emit('input', $event)"
  />
</template>

<script lang="ts">
import { Component, Vue, Model } from 'vue-property-decorator'
import { Student, getGroupUsers } from '~/api/group-users.ts'

@Component({})
export default class StudentsSelect extends Vue {
  /**
   * Текущее значение
   * @type {string}
   */
  @Model('input', { type: Array as () => string[], default: () => [] })
  readonly value!: string[]

  /**
   * Список всех студентов
   */
  students: Student[] = []

  /**
   * Флаг загрузки
   */
  loading: boolean = true

  mounted() {
    this.loadData()
  }

  /**
   * Загрузить список всех студентов
   */
  async loadData() {
    try {
      this.students = await getGroupUsers()
      this.loading = false
    } catch (error) {
      this.$vuexModules.Snackbars.ADD_SNACKBARS(error.snackbarErrors)
    }
  }
}
</script>
