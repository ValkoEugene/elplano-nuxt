<template>
  <v-app light>
    <div class="empty-layout__wrapper">
      <div class="empty-layout__title">
        <client-only>
          <logo
            :width="$vuetify.breakpoint.mdAndDown ? 200 : 400"
            :height="$vuetify.breakpoint.mdAndDown ? 25 : 50"
          />
        </client-only>
      </div>

      <div class="empty-layout__content">
        <nuxt />
      </div>
    </div>

    <Snackbars />
  </v-app>
</template>

<script>
export default {
  name: 'EmptyLayout',
  components: {
    Logo: () =>
      import('~/components/logo.vue' /* webpackChunkName: 'components/logo' */),
    Snackbars: () =>
      import(
        '~/components/UI-core/snackbars.vue' /* webpackChunkName: 'components/UI-core/snackbars' */
      )
  }
}
</script>

<style>
@media (max-width: 900px) {
  .empty-layout__wrapper {
    min-width: 100vw;
    min-height: 100vh;
  }

  .empty-layout__title {
    position: static;
    width: auto;
    text-align: center;
    margin: 20px 0;
  }

  .empty-layout__content {
    width: 90%;
    margin: auto;
  }
}

@media (min-width: 900px) {
  .empty-layout__wrapper {
    display: flex;
    align-items: center;
    width: 100vw;
    height: 100vh;
    background-size: cover;
    background-repeat: no-repeat;
  }

  .v-application:not(.theme--dark) .empty-layout__wrapper {
    background: url(~assets/images/login-bg.png);
    background-size: cover;
    background-repeat: no-repeat;
  }

  .v-application.theme--dark .empty-layout__wrapper {
    background: url(~assets/images/login-bg-dark.png);
    background-size: cover;
    background-repeat: no-repeat;
  }

  .empty-layout__title {
    position: absolute;
    width: 500px;
    top: 50px;
    left: 50px;
  }

  .empty-layout__content {
    width: 500px;
    padding-left: 50px;
  }
}
</style>
