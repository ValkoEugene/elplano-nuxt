export default ({ app }, inject) => {
  /**
   * Получить текст ошибки валидацтт
   * @param {String} rule
   * @returns {String}
   */
  function getErrorText(rule, ...args) {
    const { messages, locale } = app.i18n

    return messages[locale].rules[rule]
  }

  inject('rules', {
    required(v) {
      if (Array.isArray(v)) {
        return !v.length ? getErrorText('required') : false
      }

      return !v ? getErrorText('required') : false
    },
    getMinLength(len) {
      return (v) => {
        if (typeof v === 'number') v = String(v)

        if (typeof v !== 'string') return 'error validation type'
        return v.length < len ? getErrorText('minLength') + len : false
      }
    },
    email(v) {
      if (typeof v !== 'string') return 'error validation type'
      return v && !v.includes('@') ? getErrorText('email') : false
    },
    equal(compareValue, errorText = 'Values not equal') {
      return (v) => (v !== compareValue ? errorText : false)
    }
  })
}
