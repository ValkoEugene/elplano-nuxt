import { Plugin } from '@nuxt/types'
import { search } from '~/utils/helpers'

declare module 'vue/types/vue' {
  interface Vue {
    $customHelpers: {
      search: (v: string, s: string) => boolean
    }
  }
}

declare module '@nuxt/types' {
  interface NuxtAppOptions {
    $customHelpers: {
      search: (v: string, s: string) => boolean
    }
  }
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const customHelpers: Plugin = (context, inject) => {
  inject('customHelpers', {
    search
  })
}

export default customHelpers
