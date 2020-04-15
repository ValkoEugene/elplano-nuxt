<template>
  <ModalWrapper
    v-model="visible"
    action-type="complete"
    :updating="updating"
    @action="completeTask"
    @close="onModalClose"
  >
    <template #content>
      <v-form ref="form" :lazy-validation="true">
        <v-textarea
          v-model.trim="assigment.report"
          :label="$t('field.report')"
          type="text"
          outlined
        />

        <extra-links v-model="assigment.extra_links" />
      </v-form>
    </template>
  </ModalWrapper>
</template>

<script lang="ts">
import { Component, Vue, Ref } from 'vue-property-decorator'
import { taskApi, Assignment } from '~/api/tasks.ts'

@Component({
  components: {
    ModalWrapper: () =>
      import(
        '~/components/modal/modal-wrapper.vue' /* webpackChunkName: 'components/modal/modal-wrapper' */
      ),
    ExtraLinks: () =>
      import(
        '~/components/UI-core/fields/extra-links.vue' /* webpackChunkName: 'components/UI-core/fields/extra-links'  */
      )
  }
})
export default class TaskComplete extends Vue {
  /**
   * Ссылка на компонент формы из vuetify
   */
  @Ref()
  readonly form: { validate: () => boolean }

  /**
   * Флаг показа модального окна
   */
  visible: boolean = false

  /**
   * Id задачи
   */
  id: string = ''

  /**
   * Строка поска для селекта
   */
  search: string = ''

  /**
   * Флаг обновления
   */
  updating: boolean = false

  /**
   * Шаблон отчета о выполнении
   */
  assigmentTemplate: Assignment = {
    accomplished: true,
    report: '',
    extra_links: []
  }

  /**
   * Отчет о выполнение
   */
  assigment: Assignment = { ...this.assigmentTemplate }

  /**
   * Установить отчет о выполнение для редактирования
   */
  public async initAssigment(id: string) {
    try {
      this.id = id
      this.assigment = await taskApi.getCompletedInfo(id)
      this.assigment.accomplished = true
      this.visible = true
    } catch (error) {
      this.$vuexModules.Snackbars.ADD_SNACKBARS(error.snackbarErrors)
    }
  }

  /**
   * Обработчик закрытия модального окна
   */
  onModalClose() {
    this.assigment = { ...this.assigmentTemplate }
  }

  /**
   * Выполнить задание
   */
  async completeTask() {
    try {
      if (!this.form.validate()) return
      this.updating = true

      const id = this.id
      await taskApi.complete(id, this.assigment)

      if (this.$vuexModules.Tasks.tasks.some((task) => task.id === id)) {
        this.$vuexModules.Tasks.REMOVE_TASK(id)
      }

      this.visible = false
      this.$emit('taskCompleted')
    } catch (error) {
      this.$vuexModules.Snackbars.ADD_SNACKBARS(error.snackbarErrors)
    } finally {
      this.updating = false
    }
  }
}
</script>
