import {
  // eslint-disable-next-line import/named
  SetupContext
} from '@vue/composition-api'

import { Task } from '~/api/tasks.ts'

const VIEW_TASK = 'VIEW_TASK'
const EDIT_TASK = 'EDIT_TASK'

/** Миксин с шиной событий для предпросмотра и редактирования задач */
export const useTaskEventBus = (vm: SetupContext) => {
  const { root: $root } = vm

  /**
   * Пустая модель задания
   */
  const taskEmptyModel: Task = {
    id: '',
    title: '',
    expired_at: '',
    event_id: '',
    attachments: [],
    student_ids: [],
    description: '',
    created_at: '',
    updated_at: '',
    extra_links: []
  }

  /**
   * Отправить событие на предпросмотр задачи
   */
  const viewTaskEmit = (task: Task) => {
    $root.$emit(VIEW_TASK, task)
  }

  /**
   * Подписаться на события предпросмотра задач
   */
  const subscribeViewTask = (handler: (task: Task) => any) => {
    $root.$on(VIEW_TASK, handler)
  }

  /**
   * Отписаться от событий предпросмотра задач
   */
  const unsubscribeViewTask = (handler: (task: Task) => any) => {
    $root.$off(VIEW_TASK, handler)
  }

  /**
   * Отправить событие на редактирование задачи
   */
  const editTaskEmit = (task: Task) => {
    $root.$emit(EDIT_TASK, task)
  }

  /**
   * Отправить событие на создание новой задачи
   */
  const addNewTaskEmit = (event_id: string = '') => {
    editTaskEmit({ ...taskEmptyModel, event_id })
  }

  /**
   * Подписаться на события редактирования задач
   */
  const subscribeEditTask = (handler: (task: Task) => any) => {
    $root.$on(EDIT_TASK, handler)
  }

  /**
   * Отписаться от событий редактирования задач
   */
  const unsubscribeEditTask = (handler: (task: Task) => any) => {
    $root.$off(EDIT_TASK, handler)
  }

  return {
    viewTaskEmit,
    editTaskEmit,
    subscribeViewTask,
    unsubscribeViewTask,
    addNewTaskEmit,
    subscribeEditTask,
    unsubscribeEditTask
  }
}
