// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default ({ app }, inject) => {
  inject('customHelpers', {
    /**
     * Регистронезависимый поиск вхождения строки
     * @param {String} v - строка в которой ищем вхождение
     * @param {String} s - строка по которой ищем вхождение
     * @returns {Boolean}
     */
    search(v, s) {
      if (!v) v = ''

      return Boolean(v.search(new RegExp(s, 'i')) !== -1)
    }
  })
}
