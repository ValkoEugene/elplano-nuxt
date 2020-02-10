<template>
  <Card>
    <template v-slot:title>{{ $t(`invites.invites`) }}</template>

    <template v-slot:content>
      <v-data-table :headers="headers" :items="invites" :items-per-page="5">
        <template v-slot:item.sent_at="{ item }">{{
          formatDate(item.sent_at)
        }}</template>

        <template v-slot:item.invitation_token="{ item }">
          <v-btn
            text
            :disabled="updating"
            @click="accept(item.invitation_token)"
            >{{ $t('invites.accept') }}</v-btn
          >
        </template>
      </v-data-table>
    </template>
  </Card>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { getInvites, acceptInvite, GroupInviteI } from '~/api/user-invites.ts'
import moment from '~/plugins/moment'

interface TableHeader {
  text?: string
  sortable?: boolean
  value: string
  width?: string
}

/**
 * Компонент с списком приглашений в группы
 */
@Component({
  components: {
    Card: () =>
      import(
        '~/components/UI-core/card.vue' /* webpackChunkName: 'components/UI-core/card' */
      )
  }
})
export default class InvitesList extends Vue {
  /**
   * Заголовки таблицы
   */
  headers: TableHeader[] = [
    { text: 'Группа', sortable: false, value: 'group_title' },
    { text: 'Номер', sortable: false, value: 'group_number' },
    { text: 'Отправлено', sortable: false, value: 'sent_at' },
    { value: 'invitation_token', width: '150px' }
  ]

  /**
   * Флаг загрузки
   */
  loading: boolean = true

  /**
   * Флаг обновления
   */
  updating: boolean = false

  /**
   * Список приглашений
   */
  invites: GroupInviteI[] = []

  mounted() {
    this.loadData()
  }

  /**
   * Загрузить список приглашений
   */
  async loadData() {
    try {
      this.invites = await getInvites()
      this.loading = false
    } catch (error) {
      this.$vuexModules.Snackbars.ADD_SNACKBARS(error.snackbarErrors)
    }
  }

  /**
   * Принять приглашение
   */
  async accept(token: string) {
    try {
      this.updating = true

      await acceptInvite(token)
      await this.$vuexModules.User.getUserInfo()

      this.$router.push('/')
    } catch (error) {
      this.$vuexModules.Snackbars.ADD_SNACKBARS(error.snackbarErrors)
      this.updating = false
    }
  }

  /**
   * Форматировать дату
   * @param {String} date - дата
   */
  formatDate(date: string): string {
    return date ? moment(date).format('DD.MM.YYYY') : '-'
  }
}
</script>

<style>
.v-data-table-header.v-data-table-header-mobile {
  display: none;
}
</style>
