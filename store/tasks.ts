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
   * Флаг подгрузки данных
   */
  public appending: boolean = false

  /**
   * Флаг что загруженны все задачи
   */
  public allTaskLoaded: boolean = false

  /**
   * Флаг обновления
   */
  public updating: boolean = false

  /**
   * Установить список задач
   */
  @Mutation
  public SET_TASKS(task: Task[]) {
    this.tasks = task
  }

  /**
   * Добавить задание в список
   */
  @Mutation
  public ADD_TASK(task: Task) {
    this.tasks.push(task)
  }

  /**
   * Добавить задания в список
   */
  @Mutation
  public ADD_TASKS(tasks: Task[]) {
    this.tasks = [...this.tasks, ...tasks]
  }

  /**
   * Обновить задание в списке
   */
  @Mutation
  public UPDATE_TASK(task: Task) {
    this.tasks = this.tasks.map((item) => (item.id === task.id ? task : item))
  }

  /**
   * Обновить задание в списке
   */
  @Mutation
  public REMOVE_TASK(id: string) {
    this.tasks = this.tasks.filter((item) => item.id !== id)
  }

  /**
   * Установить флаг загрузки
   */
  @Mutation
  public SET_LOADING(loading: boolean) {
    this.loading = loading
  }

  /**
   * Установить флаг подгрузки данных
   */
  @Mutation
  public SET_APPENDING(appending: boolean) {
    this.appending = appending
  }

  /**
   * Установить флаг загрузки всех
   */
  @Mutation
  private SET_ALL_TASKS_LOADED(allTaskLoaded: boolean) {
    this.allTaskLoaded = allTaskLoaded
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
  public async loadTasks(params?: any): Promise<void> {
    if (this.appending) return

    try {
      this.SET_ALL_TASKS_LOADED(false)

      this.SET_APPENDING(true)
      if (params.pages.number === 1) this.SET_LOADING(true)
      const { filters, pages } = params
      const formatedParams: { [key: string]: any } = {}

      for (const key in filters) {
        formatedParams[`filter[${key}]`] = filters[key]
      }

      for (const key in pages) {
        formatedParams[`page[${key}]`] = pages[key]
      }

      const { data, meta } = await taskApi.loadData(formatedParams)

      this.ADD_TASKS(data)

      if (meta) {
        const { current_page, total_pages } = meta
        if (total_pages === current_page) this.SET_ALL_TASKS_LOADED(true)
      }
    } catch (error) {
      getVuexDecaratorModuleByWindow(Snackbars).ADD_SNACKBARS(
        error.snackbarErrors
      )
    } finally {
      if (params.pages.number === 1) this.SET_LOADING(false)
      this.SET_APPENDING(false)
    }
  }

  /**
   * Создать задание
   */
  @Action
  public async createTask(task: Task): Promise<void | Task> {
    try {
      this.SET_UPDATING(true)
      const savedTask = await taskApi.create(task)

      return savedTask
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
  public async updateTask(task: Task): Promise<void | Task> {
    if (!task.id) return

    try {
      this.SET_UPDATING(true)
      const updatedTask = await taskApi.update(task, task.id)
      this.UPDATE_TASK(updatedTask)

      return updatedTask
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
      this.REMOVE_TASK(id)
    } catch (error) {
      getVuexDecaratorModuleByWindow(Snackbars).ADD_SNACKBARS(
        error.snackbarErrors
      )
    } finally {
      this.SET_UPDATING(false)
    }
  }
}
