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

        <v-combobox
          v-model="assigment.extra_links"
          :items="assigment.extra_links"
          :label="$t('field.links')"
          :menu-props="{ bottom: true, offsetY: true, 'z-index': 202 }"
          :search-input.sync="search"
          :hint="search ? $t('ui.add-enter') : ''"
          :rules="[$rules.url]"
          chips
          multiple
          deletable-chips
          outlined
        >
          <template v-slot:item="{ item }">
            <v-chip label small>
              {{ item }}
            </v-chip>
            <v-spacer></v-spacer>
            <v-list-item-action @click.stop>
              <v-btn icon @click.stop.prevent="removeLink(item)">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </v-list-item-action>
          </template>
        </v-combobox>
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
   * Удалить ссылку
   */
  removeLink(link: string) {
    this.assigment.extra_links = this.assigment.extra_links.filter(
      (item) => item !== link
    )
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
