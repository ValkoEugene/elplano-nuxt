<template>
  <div class="social-networks__wrapper">
    <p class="social-networks__text">{{ $t('auth.or') }}</p>

    <div>
      <vk-auth />
      <google-auth />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({
  components: {
    vkAuth: () =>
      import(
        '~/components/auth/vkAuth.vue' /** webpackChunkName: 'components/auth' */
      ),
    googleAuth: () =>
      import(
        '~/components/auth/googleAuth.vue' /** webpackChunkName: 'components/auth' */
      )
  }
})
export default class SocialNetworks extends Vue {}
</script>

<style scoped>
.social-networks__wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 15px;
}

.social-networks__text {
  color: rgba(0, 0, 0, 0.54);
  font-weight: bold;
  font-size: 14px;
  margin-bottom: 10px;
}
</style>

<!-- Глобальные стили для компонентов авторизации через соц. сети -->
<style>
.social-networks__logo {
  cursor: pointer;
  width: 40px;
  height: 40px;
}
</style>
