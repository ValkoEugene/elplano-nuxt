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
    :loading="loading"
    :disabled="disabled"
    outlined
    attach
    @input="$emit('input', $event)"
  >
    <template #prepend-item>
      <v-list-item ripple @click="toggleSelectAll">
        <v-list-item-action>
          <v-icon :color="value.length > 0 ? 'indigo darken-4' : ''">{{
            selectAllIcon
          }}</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>{{ $t('ui.selectAll') }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-divider class="mt-2"></v-divider>
    </template>
  </v-select>
</template>

<script lang="ts">
import { Component, Vue, Model, Prop } from 'vue-property-decorator'
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
   * Флаг блокировки поля
   */
  @Prop({ type: Boolean, default: false })
  readonly disabled: boolean

  /**
   * Список всех студентов
   */
  students: Student[] = []

  /**
   * Флаг загрузки
   */
  loading: boolean = true

  /**
   * Флаг что выбраны все студенты
   */
  get allStudentSelected(): boolean {
    return this.value.length === this.students.length
  }

  /**
   * Флаг что выбрано несколько студентов
   */
  get someStudentSelected(): boolean {
    return this.value.length > 0 && !this.allStudentSelected
  }

  /**
   * Текущая иконка выбора всех студентов
   */
  get selectAllIcon(): string {
    if (this.allStudentSelected) return 'mdi-close-box'
    if (this.someStudentSelected) return 'mdi-minus-box'
    return 'mdi-checkbox-blank-outline'
  }

  mounted() {
    this.loadData()
  }

  /**
   * Выбрать/Сбросить всех
   */
  toggleSelectAll() {
    this.$emit(
      'input',
      this.allStudentSelected ? [] : this.students.map(({ id }) => id)
    )
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
