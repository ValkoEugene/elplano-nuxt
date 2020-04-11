import createMutationsSharer from 'vuex-shared-mutations'
// import createPersistedState from 'vuex-persistedstate'
import { Plugin } from '@nuxt/types'

const vuexClientPlugins: Plugin = (context) => {
  createMutationsSharer({
    predicate: (mutation: { type: string }) =>
      [
        'user/SET_USER',
        'user/SET_ACCESS_TOKEN',
        'user/SET_REFRESH_TOKEN'
      ].includes(mutation.type)
  })(context.store)

  // // Свойства хранилище которые необходимо сохранять в LocalStorage
  // const savedStateProps = ['user.useDarkTheme']

  // // Для клиента сохраняем хранилище в LocalStorage
  // createPersistedState({
  //   storage: window.localStorage,
  //   paths: savedStateProps
  // })(context.store)
}

export default vuexClientPlugins
