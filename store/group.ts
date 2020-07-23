import { VuexModule, Module, Action, Mutation } from 'vuex-module-decorators'
import getRouter from '~/plugins/getRouter.ts'
import groupApi, { GroupI } from '~/api/group.ts'
import { Snackbars } from '~/store/snackbars.ts'
import { getVuexDecaratorModuleByWindow } from '~/utils/getVuexDecaratorModuleByWindow.ts'

export const name = 'groupe'

export interface GroupStateI {
  groupId: string
  loading: boolean
  updating: boolean
  group: GroupI
  haveGroup: boolean
}

@Module({ namespaced: true, name })
export class Group extends VuexModule implements GroupStateI {
  /**
   * ID группы
   */
  public groupId: string = ''

  /**
   * Флаг загрузки
   */
  public loading: boolean = true

  /**
   * Флаг обновления
   */
  public updating: boolean = false

  /**
   * Информация о группе
   */
  public group: GroupI = {
    id: '',
    title: '',
    number: ''
  }

  /**
   * Флаг наличия группы
   */
  get haveGroup(): boolean {
    return Boolean(this.groupId)
  }

  /**
   * Установить id группы
   */
  @Mutation
  private SET_GROUP_ID(id: string) {
    this.groupId = id
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
   * Установить информацию о группе
   */
  @Mutation
  private SET_GROUP(group: GroupI) {
    this.group = group
  }

  /**
   * Установить группу
   */
  @Action
  public setGroupId(id: string) {
    const router = getRouter()

    if (!id && router.currentRoute.path !== '/group/preinstall-settings') {
      router.push('/group/preinstall-settings')
    }

    this.SET_GROUP_ID(id)
  }

  /**
   * Загрузить информацию о группе
   */
  @Action
  public async getGroup() {
    try {
      this.SET_LOADING(true)

      const group = await groupApi.show()

      this.SET_GROUP(group)
      if (group.id) this.SET_GROUP_ID(group.id)
    } catch (error) {
      getVuexDecaratorModuleByWindow(Snackbars).ADD_SNACKBARS(
        error.snackbarErrors
      )
    } finally {
      this.SET_LOADING(false)
    }
  }

  /**
   * Создать группу
   */
  @Action
  public async createGroup(data: GroupI) {
    try {
      this.SET_UPDATING(true)

      const group = await groupApi.create(data)

      this.SET_GROUP(group)
      if (group.id) this.SET_GROUP_ID(group.id)
    } catch (error) {
      getVuexDecaratorModuleByWindow(Snackbars).ADD_SNACKBARS(
        error.snackbarErrors
      )
    } finally {
      this.SET_UPDATING(false)
    }
  }

  /**
   * Обновить информацию о группе
   */
  @Action
  public async updateGroup(data: GroupI) {
    if (!data.id) return

    try {
      this.SET_UPDATING(true)

      const group = await groupApi.update(data)

      this.SET_GROUP(group)
      if (group.id) this.SET_GROUP_ID(group.id)
    } catch (error) {
      getVuexDecaratorModuleByWindow(Snackbars).ADD_SNACKBARS(
        error.snackbarErrors
      )
    } finally {
      this.SET_UPDATING(false)
    }
  }
}
