import Vue from 'vue'
import Vuex from 'vuex'
import { GroupStateI, Group, name as GroupName } from './group'
import { I18nStateI, I18n, name as I18nName } from './i18n'
import { SnackbarsStateI, Snackbars, name as SnackbarsName } from './snackbars'
import { UserStateI, User, name as UserName } from './user'

export interface RootStateI {
  group: GroupStateI
  i18n: I18nStateI
  snackbars: SnackbarsStateI
  user: UserStateI
}

Vue.use(Vuex)

const store = () =>
  new Vuex.Store({
    state: {},
    modules: {
      [I18nName]: I18n,
      [GroupName]: Group,
      [SnackbarsName]: Snackbars,
      [UserName]: User
    }
  })

export default store
