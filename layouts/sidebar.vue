<template>
  <v-navigation-drawer
    v-model="sidebarStatus"
    app
    dark
    src="/images/sidebar_bg.jpg"
    class="drawer-background"
  >
    <v-list-item>
      <v-list-item-content>
        <img
          v-if="user && user.avatar_url"
          :src="user.avatar_url"
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

    <v-list v-if="haveGroup" dense nav>
      <v-list-item v-for="item in items" :key="item.title" :to="item.url" nuxt>
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
import { UserModule } from '~/store/user.ts'
import { User as UserI } from '~/api/admin-user.ts'
import { Student } from '~/api/group-users.ts'

/**
 * Слушатель для открытие/закрытия боковой панели
 * @type {String}
 */
export const TOGGLE_SIDEBAR_ROOT_LISTENER = 'TOGGLE_SIDEBAR_ROOT_LISTENER'

@Component
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
   * Информация о пользователе
   */
  get userInfo(): UserI {
    return UserModule.userInfo
  }

  /**
   * Информация о студенте
   */
  get studentInfo(): Student {
    return UserModule.studentInfo
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
.drawer-background {
  background-image: linear-gradient(45deg, rgb(31, 71, 160), rgb(31, 71, 160));
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
</style>
