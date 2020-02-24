<template>
  <Card class="social-networks">
    <template #title>
      <p class="social-networks__title">{{ $t(`auth.${titleI18n}`) }}</p>
    </template>

    <template #content>
      <div class="social-networks__wrapper">
        <vk-auth />
        <google-auth />
        <yandex-auth />
        <facebook-auth />
      </div>
    </template>
  </Card>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component({
  components: {
    Card: () =>
      import(
        '~/components/UI-core/card.vue' /* webpackChunkName: 'components/UI-core/card' */
      ),
    vkAuth: () =>
      import(
        '~/components/auth/social-networks/vkAuth.vue' /* webpackChunkName: 'components/auth' */
      ),
    googleAuth: () =>
      import(
        '~/components/auth/social-networks/googleAuth.vue' /* webpackChunkName: 'components/auth' */
      ),
    yandexAuth: () =>
      import(
        '~/components/auth/social-networks/yandexAuth.vue' /* webpackChunkName: 'components/auth' */
      ),
    FacebookAuth: () =>
      import(
        '~/components/auth/social-networks/facebookAuth.vue' /* webpackChunkName: 'components/auth' */
      )
  }
})
export default class SocialNetworks extends Vue {
  /**
   * Свойство в  i18n для заголовка
   */
  @Prop({ type: String, required: true })
  readonly titleI18n!: string
}
</script>

<style scoped>
.social-networks {
  margin-top: 25px;
}

.social-networks__title {
  width: 100%;
  margin-bottom: 0;
  text-align: center;
  color: #b0b0b0;
}

.social-networks__wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: space-around;
  /* margin-top: 15px; */
}

.social-networks__text {
  color: rgba(0, 0, 0, 0.54);
  font-weight: bold;
  font-size: 14px;
  margin-bottom: 10px;
}

@media (max-width: 900px) {
  .social-networks {
    margin-bottom: 25px;
  }
}
</style>
