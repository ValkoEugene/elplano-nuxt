import {
  VuexModule,
  Module,
  Action,
  Mutation,
  getModule
} from 'vuex-module-decorators'
import getRouter from '~/plugins/getRouter'
import groupApi, { GroupI } from '~/api/group.ts'
import { Snackbars } from './snackbars'
import { getVuexDecaratorModuleByWindow } from '~/utils/getVuexDecaratorModuleByWindow'

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
  public groupId: string = ''
  public loading: boolean = true
  public updating: boolean = true
  public group: GroupI = {
    id: '',
    title: '',
    number: ''
  }

  get haveGroup(): boolean {
    return Boolean(this.groupId)
  }

  @Mutation
  private SET_GROUP_ID(id: string) {
    this.groupId = id
  }

  @Mutation
  private SET_LOADING(loading: boolean) {
    this.loading = loading
  }

  @Mutation
  private SET_UPDATING(updating: boolean) {
    this.updating = updating
  }

  @Mutation
  private SET_GROUP(group: GroupI) {
    this.group = group
  }

  @Action
  public setGroupId(id: string) {
    const router = getRouter()

    if (!id && router.currentRoute.path !== '/group/ungrouped') {
      router.push('/group/ungrouped')
    }

    this.SET_GROUP_ID(id)
  }

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

  @Action
  public async createGroup(data: GroupI) {
    try {
      this.SET_UPDATING(true)

      const group = await groupApi.create(data)

      this.SET_GROUP(group)
      if (group.id) this.SET_GROUP_ID(group.id)

      // Используем location чтобы страница перезагрузилась и все состояние vuex сбросилось
      window.location.replace('/')
    } catch (error) {
      getVuexDecaratorModuleByWindow(Snackbars).ADD_SNACKBARS(
        error.snackbarErrors
      )
    } finally {
      this.SET_UPDATING(false)
    }
  }

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
