<template>
  <div>log-off</div>
</template>

<script>
import { Types, namespace } from '~/store/user'

export default {
  name: 'LogOff',
  layout: 'empty',
  mounted() {
    this.$store.dispatch(`${namespace}/${Types.actions.RESET_USER}`)

    // Используем location чтобы страница перезагрузилась и все состояние vuex сбросилось
    window.location.replace('/login')
  }
}
</script>
