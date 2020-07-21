const cardScroll = {
  bind(el, binding, vnode) {
    el.cardScrollHandler = (event) => {
      const limit = parseInt(binding.arg)

      const { target } = event
      const { scrollTop, scrollHeight, clientHeight } = target

      if (scrollHeight - scrollTop - clientHeight < limit) {
        vnode.context[binding.expression](event)
      }
    }

    const wrapper = document.querySelector('.v-main__wrap')

    wrapper.addEventListener('scroll', el.cardScrollHandler)
  },
  unbind(el) {
    const wrapper = document.querySelector('.v-main__wrap')
    wrapper.removeEventListener('scroll', el.cardScrollHandler)
  }
}

export default cardScroll
