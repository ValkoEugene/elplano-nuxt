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
        <v-tab>
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

<script>
import { namespace, Types } from '../../store/user'

export default {
  name: 'AdminPage',
  components: {
    About: () => import('../../components/admin/about.vue'),
    SystemHealf: () => import('../../components/admin/system-healf.vue'),
    SystemInformation: () =>
      import('../../components/admin/system-information.vue'),
    Users: () => import('../../components/admin/users.vue')
  },
  layout: 'empty',
  data: () => ({
    /**
     * Активный таб
     * @type {Number}
     */
    tab: 0
  }),
  computed: {
    /**
     * Флаг что пользователь является админом
     * @type {Boolean}
     */
    isAdmin() {
      return this.$store.getters[`${namespace}/${Types.getters.IS_ADMIN}`]
    }
  },
  mounted() {
    if (!this.isAdmin) {
      this.$router.push('/')
    }
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
