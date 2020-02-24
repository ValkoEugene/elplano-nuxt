import { Component, Vue } from 'vue-property-decorator'

import { Task } from '~/api/tasks.ts'

const VIEW_TASK = 'VIEW_TASK'
const EDIT_TASK = 'EDIT_TASK'

/**
 * Миксин с шиной событий для предпросмотра и редактирования задач
 */
@Component
export default class TaskEventBus extends Vue {
  /**
   * Пустая модель задания
   */
  taskEmptyModel: Task = {
    id: '',
    title: '',
    expired_at: '',
    event_id: '',
    attachments: [],
    description: '',
    created_at: '',
    updated_at: ''
  }

  /**
   * Отправить событие на предпросмотр задачи
   */
  viewTaskEmit(task: Task) {
    this.$root.$emit(VIEW_TASK, task)
  }

  /**
   * Подписаться на события предпросмотра задач
   */
  subscribeViewTask(handler: (task: Task) => any) {
    this.$root.$on(VIEW_TASK, handler)
  }

  /**
   * Отписаться от событий предпросмотра задач
   */
  unsubscribeViewTask(handler: (task: Task) => any) {
    this.$root.$off(VIEW_TASK, handler)
  }

  /**
   * Отправить событие на редактирование задачи
   */
  editTaskEmit(task: Task) {
    this.$root.$emit(EDIT_TASK, task)
  }

  /**
   * Отправить событие на создание новой задачи
   */
  addNewTaskEmit(event_id: string = '') {
    this.editTaskEmit({ ...this.taskEmptyModel, event_id })
  }

  /**
   * Подписаться на события редактирования задач
   */
  subscribeEditTask(handler: (task: Task) => any) {
    this.$root.$on(EDIT_TASK, handler)
  }

  /**
   * Отписаться от событий редактирования задач
   */
  unsubscribeEditTask(handler: (task: Task) => any) {
    this.$root.$off(EDIT_TASK, handler)
  }
}
