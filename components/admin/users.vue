<template>
  <div>
    <!-- TODO infinite scroll -->
    <!-- <div
      v-infinite-scroll="loadMore"
      infinite-scroll-disabled="loading"
      infinite-scroll-distance="10"
      class="users__wrapper"
    > -->
    <div class="users__wrapper">
      <div v-for="user in users" :key="user.id">
        <Card :avatar-url="user.avatar" class="user__wrapper">
          <template v-if="haveBadges(user)" v-slot:badges>
            <span v-if="user.admin">admin</span>
            <span v-if="user.banned">banned</span>
            <span v-if="user.locked">locked</span>
            <span v-if="user.confirmed">confirmed</span>
          </template>

          <template v-slot:title>{{ user.email }}</template>

          <template v-slot:content>
            <div class="user__info">
              <p>Username: {{ user.username }}</p>

              <template v-if="user.student">
                <p>User full name: {{ user.student.full_name }}</p>
                <p>User phone: {{ user.student.phone }}</p>
              </template>
            </div>
          </template>

          <template v-if="!user.admin" v-slot:menu>
            <v-list-item
              v-if="!user.banned"
              :disabled="updating"
              @click="updateUser('ban', user)"
            >
              ban
            </v-list-item>
            <v-list-item
              v-if="user.banned"
              :disabled="updating"
              @click="updateUser('unban', user)"
            >
              unban
            </v-list-item>
            <v-list-item
              v-if="user.locked"
              :disabled="updating"
              @click="updateUser('unlock', user)"
            >
              unlock
            </v-list-item>
            <v-list-item
              v-if="!user.confirm"
              :disabled="updating"
              @click="updateUser('confirm', user)"
            >
              confirm
            </v-list-item>
          </template>
        </Card>
      </div>

      <div @click="loadMore">Loading...</div>
    </div>
  </div>
</template>

<script>
import infiniteScroll from 'vue-infinite-scroll'
import adminUserApi from '../../api/admin-user'
import { addSnackbarsByStore } from '../../store/snackbars'

export default {
  name: 'AdminUsers',
  components: {
    // TODO проблема с алиасом
    // eslint-disable-next-line import/no-unresolved
    Card: () => import('~/components/UI-core/card.vue')
  },
  directives: {
    infiniteScroll
  },
  data: () => ({
    /**
     * Флаг загрузки
     * @type {Boolean}
     */
    loading: true,

    /**
     * Флаг обновления
     * @type {Boolean}
     */
    updating: false,

    /**
     * Список пользователей
     * @type {Array}
     */
    users: [],

    /**
     * Строка поиска
     * // TODO
     * @type {String}
     */
    search: ''
  }),
  mounted() {
    this.loadData()
  },
  methods: {
    /**
     * Проверить наличие бейджев для пользователя
     * @param {Object} user - пользователь
     * @return {Boolean}
     */
    haveBadges({ admin, banned, confirmed, locked }) {
      return admin || banned || confirmed || locked
    },

    /**
     * Загрузить список пользователей
     * @type {Function}
     * @param {Object} params - параметры запроса
     */
    async loadData(params = {}) {
      try {
        this.loading = true

        const users = await adminUserApi.loadData(params)
        this.users = [...this.users, ...users]

        this.loading = false
      } catch (error) {
        addSnackbarsByStore(this.$store, error.snackbarErrors)
      }
    },

    /**
     * Догрузить пользователей
     * @type {Function}
     */
    loadMore() {
      const params = {
        filters: {
          search: this.search,
          last_id: this.users[this.users.length - 1].id
        }
      }

      this.loadData(params)
    },

    /**
     * Обновить состояние пользователя
     * @type {Function}
     * @param {('ban' | 'unban' | 'unlock', ''confirm')} action_type - тип действия
     * @param {String} id - идентификатор пользователя
     */
    async updateUser(action_type, user) {
      try {
        this.updating = true
        await adminUserApi.update({ action_type }, user.id)

        switch (action_type) {
          case 'ban':
            user.banned = true
            break
          case 'unban':
            user.banned = false
            break
          case 'unlock':
            user.locked = false
            break
          case 'confirm':
            user.confirmed = true
            break
        }
      } catch (error) {
        addSnackbarsByStore(this.$store, error.snackbarErrors)
      } finally {
        this.updating = false
      }
    }
  }
}
</script>

<style scoped>
.user__wrapper {
  margin: 15px;
  margin-bottom: 25px;
}

.user__wrapper span {
  background: #3f51b5 !important;
}

.user__info {
  padding: 5px 5px 5px 15px;
  flex-grow: 1;
}

.user__info p {
  margin: 0;
}
</style>
