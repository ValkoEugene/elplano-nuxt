<template>
  <div>log-off</div>
</template>

<script>
import { Types, namespace } from '../store/user'

export default {
  name: 'LogOff',
  layout: 'empty',
  created() {
    this.$store.dispatch(`${namespace}/${Types.actions.RESET_USER}`)
    // TODO сброс данных о пользователе
    this.$router.push('/login')
  }
}
</script>
