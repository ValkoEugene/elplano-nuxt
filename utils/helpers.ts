/**
 * Регистронезависимый поиск вхождения строки
 * @param {String} v - строка в которой ищем вхождение
 * @param {String} s - строка по которой ищем вхождение
 * @returns {Boolean}
 */
export const search = (v: string, s: string): boolean => {
  if (!v) v = ''

  return Boolean(v.search(new RegExp(s, 'i')) !== -1)
}
