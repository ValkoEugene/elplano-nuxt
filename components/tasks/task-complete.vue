<template>
  <ModalWrapper
    ref="modalWrapper"
    action-type="complete"
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
import ModalWrapper from '~/components/modal/modal-wrapper.vue'

@Component({
  components: {
    ModalWrapper
  }
})
export default class TaskComplete extends Vue {
  /**
   * Ссылка на экземпляр компонента ModalWrapper
   */
  @Ref('modalWrapper')
  readonly modalWrapper!: ModalWrapper

  /**
   * Id задачи
   */
  id: string = ''

  search: string = ''

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
      this.modalWrapper.open()
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

  onModalClose() {
    this.assigment = { ...this.assigmentTemplate }
  }

  /**
   * Выполнить задание
   */
  async completeTask() {
    try {
      const id = this.id
      await taskApi.complete(id, this.assigment)

      if (this.$vuexModules.Tasks.tasks.some((task) => task.id === id)) {
        this.$vuexModules.Tasks.REMOVE_TASK(id)
      }

      this.modalWrapper.close()
      this.$emit('taskCompleted')
    } catch (error) {
      this.$vuexModules.Snackbars.ADD_SNACKBARS(error.snackbarErrors)
    }
  }
}
</script>
