<template>
  <v-content v-if="isAdmin">
    <v-card class="admin__card">
      <v-tabs v-model="tab" fixed-tabs background-color="indigo" dark>
        <v-tab>
          About
        </v-tab>
        <v-tab>
          System information
        </v-tab>
        <v-tab>
          Admin users
        </v-tab>
        <v-tab @click="logout">
          Logout
        </v-tab>
      </v-tabs>

      <div class="admin__content">
        <About v-show="tab === 0" />
        <div v-show="tab === 1">
          <SystemHealf />
          <SystemInformation />
        </div>
        <Users v-if="tab === 2" />
      </div>
    </v-card>
  </v-content>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { UserModule } from '~/store/user.ts'

@Component({
  components: {
    About: () => import('~/components/admin/about.vue'),
    SystemHealf: () => import('~/components/admin/system-healf.vue'),
    SystemInformation: () =>
      import('~/components/admin/system-information.vue'),
    Users: () => import('~/components/admin/users.vue')
  },
  layout: 'empty'
})
export default class AdminPage extends Vue {
  /**
   * Активный таб
   */
  tab: number | null = 0

  /**
   * Флаг что пользователь является админом
   */
  get isAdmin(): boolean {
    return UserModule.isAdmin
  }

  mounted() {
    if (!this.isAdmin) {
      this.$router.push('/')
    }
  }

  /**
   * Выход
   */
  logout() {
    this.$router.replace('/log-off')
  }
}
</script>

<style scoped>
.admin__card {
  margin: 25px;
}

.admin__content {
  padding: 25px;
}
</style>
