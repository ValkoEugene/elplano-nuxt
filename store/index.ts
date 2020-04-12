import Vue from 'vue'
import Vuex from 'vuex'
// eslint-disable-next-line import/no-unresolved
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
import { Tasks, TasksStateI, name as TasksName } from '~/store/tasks.ts'
import { getUseDarkThemeFromCookie } from '~/utils/auth'

export interface RootStateI {
  group: GroupStateI
  i18n: I18nStateI
  snackbars: SnackbarsStateI
  user: UserStateI
  labels: LabelsStateI
  tasks: TasksStateI
}

Vue.use(Vuex)

const store = () =>
  new Vuex.Store({
    state: {},
    actions: {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      async nuxtServerInit({ commit }, { route, req, $vuetify }: Context) {
        console.log(
          'nuxtServerInit ',
          route.fullPath,
          +new Date(),
          req.headers.cookie
        )

        // Инициализируем тему
        let useDarkTheme = getUseDarkThemeFromCookie(req)
        if (typeof useDarkTheme === 'string') {
          useDarkTheme = JSON.parse(useDarkTheme)
        }
        $vuetify.theme.dark = useDarkTheme
        commit('user/SET_USE_DARK_THEME', useDarkTheme)
      }
    },
    modules: {
      [I18nName]: I18n,
      [GroupName]: Group,
      [SnackbarsName]: Snackbars,
      [UserName]: User,
      [LabelsName]: Labels,
      [TasksName]: Tasks
    }
  })

export default store
