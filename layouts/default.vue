<template>
  <v-app light :style="cssVariblesFromTheme">
    <Sidebar />

    <Header />

    <!-- Sizes your content based upon application components -->
    <v-content>
      <!-- Provides the application the proper gutter -->
      <!-- <v-container fluid> -->
      <!-- If using vue-router -->
      <div :class="[$vuetify.breakpoint.smAndDown ? '' : 'pa-6']">
        <Loader v-if="loading" />

        <nuxt v-else />
      </div>
      <Snackbars />
      <!-- </v-container> -->
    </v-content>
  </v-app>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { namespace, Types } from '../store/user'

export default {
  name: 'DefaultLayout',
  // Проверяем что пользователь авторизован
  middleware: ['auth'],
  components: {
    Loader: () => import('../components/UI-core/loader.vue'),
    Sidebar: () => import('./sidebar.vue'),
    Header: () => import('./header.vue'),
    Snackbars: () => import('../components/UI-core/snackbars.vue')
  },
  computed: {
    ...mapState(namespace, [
      /**
       * Флаг загрузки
       * @type {Boolean}
       */
      'loading',

      /**
       * Пользователь
       * @type {Object | null}
       */
      'userInfo'
    ]),

    /**
     * Стили с css переменными из темы
     * @type {Object}
     */
    cssVariblesFromTheme() {
      return {
        '--secondary-color': this.$vuetify.theme.currentTheme.secondary,
        '--primary-base': this.$vuetify.theme.currentTheme.primary.base,
        '--primary-lighten1': this.$vuetify.theme.currentTheme.primary.lighten1,
        '--primary-lighten2': this.$vuetify.theme.currentTheme.primary.lighten2,
        '--primary-lighten3': this.$vuetify.theme.currentTheme.primary.lighten3,
        '--primary-lighten4': this.$vuetify.theme.currentTheme.primary.lighten4,

        '--primary-darken1': this.$vuetify.theme.currentTheme.primary.darken1,
        '--primary-darken2': this.$vuetify.theme.currentTheme.primary.darken2,
        '--primary-darken3': this.$vuetify.theme.currentTheme.primary.darken3,
        '--primary-darken4': this.$vuetify.theme.currentTheme.primary.darken4,

        '--primary-accent1': this.$vuetify.theme.currentTheme.primary.accent1,
        '--primary-accent2': this.$vuetify.theme.currentTheme.primary.accent2,
        '--primary-accent3': this.$vuetify.theme.currentTheme.primary.accent3,
        '--primary-accent4': this.$vuetify.theme.currentTheme.primary.accent4
      }
    }
  },
  mounted() {
    this.getUserInfo()
  },
  methods: {
    ...mapActions(namespace, {
      /**
       * Загрузить информацию о пользователе
       * @type {Function}
       */
      getUserInfo: Types.actions.GET_USER_INFO
    })
  }
}
</script>

<style>
/* Создаем css классы на основе цветовой схемы указанной в nuxt-config */
.text-secondary {
  color: var(--secondary-color) !important;
}

.text-primary {
  color: var(--primary-base) !important;
}

.text-primary-lighten1 {
  color: var(--primary-lighten1) !important;
}
.text-primary-lighten2 {
  color: var(--primary-lighten2) !important;
}
.text-primary-lighten3 {
  color: var(--primary-lighten3) !important;
}
.text-primary-lighten4 {
  color: var(--primary-lighten4) !important;
}

.text-primary-darken1 {
  color: var(--primary-darken1) !important;
}
.text-primary-darken2 {
  color: var(--primary-darken2) !important;
}
.text-primary-darken3 {
  color: var(--primary-darken3) !important;
}
.text-primary-darken4 {
  color: var(--primary-darken4) !important;
}

.text-primary-accent1 {
  color: var(--primary-accent1) !important;
}
.text-primary-accent2 {
  color: var(--primary-accent2) !important;
}
.text-primary-accent3 {
  color: var(--primary-accent3) !important;
}
.text-primary-accent4 {
  color: var(--primary-accent4) !important;
}

.bg-primary {
  background: var(--primary-base) !important;
}

.bg-primary-lighten1 {
  background: var(--primary-lighten1) !important;
}
.bg-primary-lighten2 {
  background: var(--primary-lighten2) !important;
}
.bg-primary-lighten3 {
  background: var(--primary-lighten3) !important;
}
.bg-primary-lighten4 {
  background: var(--primary-lighten4) !important;
}

.bg-primary-darken1 {
  background: var(--primary-darken1) !important;
}
.bg-primary-darken2 {
  background: var(--primary-darken2) !important;
}
.bg-primary-darken3 {
  background: var(--primary-darken3) !important;
}
.bg-primary-darken4 {
  background: var(--primary-darken4) !important;
}

.bg-primary-accent1 {
  background: var(--primary-accent1) !important;
}
.bg-primary-accent2 {
  background: var(--primary-accent2) !important;
}
.bg-primary-accent3 {
  background: var(--primary-accent3) !important;
}
.bg-primary-accent4 {
  background: var(--primary-accent4) !important;
}
</style>
