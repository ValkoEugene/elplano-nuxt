import Vuex from 'vuex'
import { GroupStateI } from './group'
import { I18nStateI } from './i18n'
import { SnackbarsStateI } from './snackbars'
import { UserStateI } from './user'

// Vue.use(Vuex)

export interface RootStateI {
  group: GroupStateI
  i18n: I18nStateI
  snackbars: SnackbarsStateI
  user: UserStateI
}

// // Declare empty store first, dynamically register all modules later.
// export default () => new Vuex.Store<RootStateI>({})

// import Vuex from 'vuex'

// Declare empty store first, dynamically register all modules later.
const createStore = () => new Vuex.Store<RootStateI>({})

export default createStore
