import { Plugin } from '@nuxt/types'

/**
 * Вспомогательная функция проверки на url ссылку
 */
const isValidUrl = (value: string): boolean => {
  // eslint-disable-next-line no-useless-escape
  return /^(?:http(s)?:\/\/)?[a-zA-Zа-яёА-ЯЁ0-9.\-]+(?:\.[a-zA-Zа-яёА-ЯЁ0-9.\-]+)+[a-zA-Zа-яёА-ЯЁ0-9\-\._~:/?#[\]@!\%\$&'\(\)\*\+,;=.]+$/.test(
    value
  )
}

declare module 'vue/types/vue' {
  interface Vue {
    $rules: {
      required(v: any): string | true
      getMinLength(len: number): (v: any) => string | true
      email(v: any): string | true
      url(v: any): string | true
      equal(
        compareValue: string,
        errorText?: string
      ): (v: string) => string | true
    }
  }
}

declare module '@nuxt/types' {
  interface NuxtAppOptions {
    $rules: {
      required(v: any): string | true
      getMinLength(len: number): (v: any) => string | true
      email(v: any): string | true
      url(v: any): string | true
      equal(
        compareValue: string,
        errorText?: string
      ): (v: string) => string | true
    }
  }
}

/**
 * Функция валидатор принимает значение
 * Если возвращается false - валидация прошла
 * Если возвращается string - текст выводится как ошибка
 */
export type Rule = (value: any) => string | false

const rulesPlugin: Plugin = (context, inject) => {
  /**
   * Получить текст ошибки валидацтт
   * @param {String} rule
   * @returns {String}
   */
  function getErrorText(rule: string /** ...args */): string {
    const { messages, locale } = context.app.i18n as {
      messages: any
      locale: string
    }

    return messages[locale].rules[rule]
  }

  const rules = {
    /**
     * Валидатор - Обязательное поле
     */
    required(v: any): string | true {
      if (Array.isArray(v)) {
        return !v.length ? getErrorText('required') : true
      }

      return !v ? getErrorText('required') : true
    },

    /**
     * Валидатор для проверки минимального количества символов
     * Возвращает функцию которой надо передать число с минимальным кол-вом символов
     */
    getMinLength(len: number): (v: any) => string | true {
      return (v: any) => {
        if (typeof v === 'number') v = String(v)

        if (typeof v !== 'string') return 'error validation type'
        return v.length < len ? getErrorText('minLength') + len : true
      }
    },

    /**
     * Валидатор проверки на соответствие строки валидному email
     */
    email(v: any): string | true {
      if (!v) return true
      if (typeof v !== 'string') return 'error validation type'
      return v && !v.includes('@') ? getErrorText('email') : true
    },

    /**
     * Валидатор url ссылки
     */
    url(v: any): string | true {
      if (typeof v === 'string') {
        return v && !isValidUrl(v) ? getErrorText('url') : true
      } else if (Array.isArray(v)) {
        for (const valueItem of v) {
          if (valueItem && !isValidUrl(valueItem)) return getErrorText('url')
        }

        return true
      } else return 'error validation type'
    },

    /**
     * Валидатор сравнения двух строк
     * @param compareValue - значение для сравнения
     * @param errorText - текст сообщения с ошибкой
     * @return {Function} - возвращает функцию для сравнения
     */
    equal(
      compareValue: string,
      errorText = 'Values not equal'
    ): (v: string) => string | true {
      return (v) => (v !== compareValue ? errorText : true)
    }
  }

  inject('rules', rules)
}

export default rulesPlugin
