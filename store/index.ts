import Vue from 'vue'
import Vuex from 'vuex'
import { Context } from '@nuxt/types'
import { GroupStateI, Group, name as GroupName } from '~/store/group.ts'
import { I18nStateI, I18n, name as I18nName } from '~/store/i18n.ts'
import {
  SnackbarsStateI,
  Snackbars,
  name as SnackbarsName
} from '~/store/snackbars.ts'
import { UserStateI, User, name as UserName } from '~/store/user.ts'
import { Labels, LabelsStateI, name as LabelsName } from '~/store/labels.ts'

export interface RootStateI {
  group: GroupStateI
  i18n: I18nStateI
  snackbars: SnackbarsStateI
  user: UserStateI
  labels: LabelsStateI
}

Vue.use(Vuex)

const store = () =>
  new Vuex.Store({
    state: {},
    actions: {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      nuxtServerInit({ commit }, { route, req, redirect }: Context) {
        console.log(
          'nuxtServerInit ',
          route.fullPath,
          +new Date(),
          req.headers.cookie
        )
      }
    },
    modules: {
      [I18nName]: I18n,
      [GroupName]: Group,
      [SnackbarsName]: Snackbars,
      [UserName]: User,
      [LabelsName]: Labels
    }
  })

export default store
