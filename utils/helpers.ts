/**
 * Регистронезависимый поиск вхождения строки
 * @param {String} v - строка в которой ищем вхождение
 * @param {String} s - строка по которой ищем вхождение
 * @returns {Boolean}
 */
export const search = (v: string, s: string): boolean => {
  if (!v) v = ''

  // Экранируем спецсимволы
  const validSearch = s.replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1')

  return Boolean(v.search(new RegExp(validSearch, 'i')) !== -1)
}
