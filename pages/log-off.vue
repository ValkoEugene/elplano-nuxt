<template>
  <div>log-off</div>
</template>

<script>
export default {
  name: 'LogOff',
  layout: 'empty',
  created() {
    // TODO сброс данных о пользователе
    this.$router.push('/login')
  }
}
</script>
