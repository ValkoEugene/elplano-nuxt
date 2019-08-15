import Vue from 'vue'

Vue.prototype.$rules = {
  required(v) {
    return !v ? 'Обязательное поле' : false
  },
  getMinLength(len) {
    return (v) => {
      if (typeof v === 'number') v = String(v)

      if (typeof v !== 'string') return 'Значение должно быть строкой'
      return v.length < len ? `Минимум ${len} символов` : false
    }
  },
  email(v) {
    if (typeof v !== 'string') return 'Значение должно быть строкой'
    return v && !v.includes('@') ? 'Email должен содержать @' : false
  },
  equal(compareValue, errorText = 'Значение не совпадает') {
    return (v) => (v !== compareValue ? errorText : false)
  }
}
