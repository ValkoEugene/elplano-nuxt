<template>
  <v-navigation-drawer
    v-model="sidebarStatus"
    app
    dark
    src="/images/sidebar_bg.jpg"
    class="drawer-background"
  >
    <logo :width="200" :height="30" :white="true" class="sidebar__logo" />

    <v-list-item>
      <v-list-item-content>
        <img
          v-if="user && user.avatar"
          :src="user.avatar"
          class="user__avatar"
        />
        <v-list-item-title class="title">{{
          user && user.username
        }}</v-list-item-title>
        <v-list-item-subtitle>{{
          student && student.full_name
        }}</v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>

    <v-divider></v-divider>

    <v-list dense nav>
      <v-list-item
        v-for="item in items"
        :key="item.title"
        :to="item.url"
        :disabled="isSidebarDisabled"
        nuxt
      >
        <v-list-item-icon>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { User as UserI } from '~/api/admin-user.ts'
import { Student } from '~/api/group-users.ts'

/**
 * Слушатель для открытие/закрытия боковой панели
 * @type {String}
 */
export const TOGGLE_SIDEBAR_ROOT_LISTENER = 'TOGGLE_SIDEBAR_ROOT_LISTENER'

@Component({
  components: {
    Logo: () =>
      import('~/components/logo.vue' /* webpackChunkName: 'components/logo' */)
  }
})
export default class Sidebar extends Vue {
  /**
   * Флаг наличия группы
   */
  @Prop({ type: Boolean, required: true })
  readonly haveGroup!: boolean

  /**
   * Статус боковой панели
   */
  sidebarStatus: boolean = false

  /**
   * Пункты меню
   */
  get items() {
    return [
      {
        title: this.$t('sidebar.schedule'),
        icon: 'mdi-view-dashboard',
        url: '/schedule'
      },
      {
        title: this.$t('sidebar.tasks'),
        icon: 'mdi-briefcase',
        url: '/tasks-tabs'
      },
      {
        title: this.$t('sidebar.lessons'),
        icon: 'mdi-bookshelf',
        url: '/courses'
      },
      {
        title: this.$t('sidebar.teachers'),
        icon: 'mdi-account-supervisor',
        url: '/lecturers'
      },
      {
        title: this.$t('sidebar.group'),
        icon: 'mdi-account-group',
        url: '/group'
      },
      {
        title: this.$t('sidebar.measure'),
        icon: 'mdi-help-box',
        url: '/measure'
      },
      {
        title: this.$t('sidebar.ratings'),
        icon: 'mdi-star-half',
        url: '/ratings'
      },
      {
        title: this.$t('sidebar.attachments'),
        icon: 'mdi-briefcase-download',
        url: '/attachments'
      }
    ]
  }

  /**
   * Информация о пользователе
   */
  get user(): UserI {
    return this.$vuexModules.User.userInfo
  }

  /**
   * Информация о студенте
   */
  get student(): Student {
    return this.$vuexModules.User.studentInfo
  }

  /**
   * Флаг блокировки бокового меню
   */
  get isSidebarDisabled(): boolean {
    return !this.haveGroup || !this.$vuexModules.User.haveProfileInfo
  }

  mounted() {
    /**
     * Слушаем событие через root для открытия/закрытия боковой панели
     */
    this.$root.$on(TOGGLE_SIDEBAR_ROOT_LISTENER, this.toggleSidebar)

    this.sidebarStatus = !this.$vuetify.breakpoint.smAndDown
  }

  /**
   * Сменить статус боковой панели
   */
  toggleSidebar() {
    this.sidebarStatus = !this.sidebarStatus
  }
}
</script>

<style>
.v-list-item--disabled {
  opacity: 0.3;
}

.drawer-background {
  background-image: linear-gradient(45deg, rgb(31, 71, 160), rgb(31, 71, 160));
}

.theme--dark .drawer-background {
  background-image: linear-gradient(45deg, rgb(51, 46, 86), rgb(51, 46, 86));
}

.v-navigation-drawer__image {
  opacity: 0.05;
}

.v-application .v-navigation-drawer__content a {
  color: #ffffff;
}

.user__avatar {
  height: 100px;
  width: 100px;
  flex: none;
  margin: auto;
  border-radius: 50%;
  padding: 5px;
  box-shadow: 0px 3px 5px -1px rgba(0, 0, 0, 0.2),
    0px 5px 8px 0px rgba(0, 0, 0, 0.14), 0px 1px 14px 0px rgba(0, 0, 0, 0.12) !important;
}

.sidebar__logo {
  position: absolute;
  bottom: 20px;
  left: 30px;
}
</style>
