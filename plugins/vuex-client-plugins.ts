import createMutationsSharer from 'vuex-shared-mutations'
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
}

export default vuexClientPlugins
