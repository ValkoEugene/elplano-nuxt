import { VuexModule, Module, Action, Mutation } from 'vuex-module-decorators'
import { Task, taskApi } from '~/api/tasks.ts'
import { Snackbars } from '~/store/snackbars.ts'
import { getVuexDecaratorModuleByWindow } from '~/utils/getVuexDecaratorModuleByWindow.ts'

export const name = 'tasks'

export interface TasksStateI {
  tasks: Task[]
  loading: boolean
  updating: boolean
}

@Module({ namespaced: true, name })
export class Tasks extends VuexModule implements TasksStateI {
  /**
   * Список задач
   */
  public tasks: Task[] = []

  /**
   * Флаг загрузки
   */
  public loading: boolean = true

  /**
   * Флаг обновления
   */
  public updating: boolean = false

  /**
   * Установить список задач
   */
  @Mutation
  private SET_TASKS(task: Task[]) {
    this.tasks = task
  }

  /**
   * Добавить задание в список
   */
  @Mutation
  private ADD_TASK(task: Task) {
    this.tasks.push(task)
  }

  /**
   * Обновить задание в списке
   */
  @Mutation
  private UPDATE_TASK(task: Task) {
    this.tasks = this.tasks.map((item) => (item.id === task.id ? task : item))
  }

  /**
   * Обновить задание в списке
   */
  @Mutation
  private DELETE_TASK(id: string) {
    this.tasks = this.tasks.filter((item) => item.id !== id)
  }

  /**
   * Установить флаг загрузки
   */
  @Mutation
  private SET_LOADING(loading: boolean) {
    this.loading = loading
  }

  /**
   * Установить флаг обновления
   */
  @Mutation
  private SET_UPDATING(updating: boolean) {
    this.updating = updating
  }

  /**
   * Загрузить список задач
   */
  @Action
  public async loadTasks(): Promise<void> {
    try {
      this.SET_LOADING(true)

      const tasks = await taskApi.loadData()

      this.SET_TASKS(tasks)
      this.SET_LOADING(false)
    } catch (error) {
      getVuexDecaratorModuleByWindow(Snackbars).ADD_SNACKBARS(
        error.snackbarErrors
      )
    }
  }

  /**
   * Создать задание
   */
  @Action
  public async createTask(task: Task): Promise<void> {
    try {
      this.SET_UPDATING(true)
      const savedTask = await taskApi.create(task)
      this.ADD_TASK(savedTask)
    } catch (error) {
      getVuexDecaratorModuleByWindow(Snackbars).ADD_SNACKBARS(
        error.snackbarErrors
      )
    } finally {
      this.SET_UPDATING(false)
    }
  }

  /**
   * Обновить задание
   */
  @Action
  public async updateTask(task: Task): Promise<void> {
    if (!task.id) return

    try {
      this.SET_UPDATING(true)
      const updatedTask = await taskApi.update(task, task.id)
      this.UPDATE_TASK(updatedTask)
    } catch (error) {
      getVuexDecaratorModuleByWindow(Snackbars).ADD_SNACKBARS(
        error.snackbarErrors
      )
    } finally {
      this.SET_UPDATING(false)
    }
  }

  /**
   * Удалить задание
   */
  @Action
  public async deleteTask(id: string): Promise<void> {
    try {
      this.SET_UPDATING(true)
      await taskApi.deleteById(id)
      this.DELETE_TASK(id)
    } catch (error) {
      getVuexDecaratorModuleByWindow(Snackbars).ADD_SNACKBARS(
        error.snackbarErrors
      )
    } finally {
      this.SET_UPDATING(false)
    }
  }
}
