import { Plugin } from '@nuxt/types'
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
    /**
     * Регистронезависимый поиск вхождения строки
     * @param {String} v - строка в которой ищем вхождение
     * @param {String} s - строка по которой ищем вхождение
     * @returns {Boolean}
     */
    search(v: string, s: string): boolean {
      if (!v) v = ''

      return Boolean(v.search(new RegExp(s, 'i')) !== -1)
    }
  })
}

export default customHelpers
