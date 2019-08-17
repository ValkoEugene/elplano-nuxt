/**
 * Функция, которая не будет срабатывать, чаще чем через N миллисекунд после последнего вызова.
 */
export default function throttle(fn, delay) {
  let timer = null

  return function throttled(...args) {
    const context = this

    clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(context, args)
    }, delay)
  }
}
