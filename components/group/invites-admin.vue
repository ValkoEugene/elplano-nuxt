<template>
  <div v-if="loading">
    <Loader :show-form="true" :form-inputs-count="1" class="mb-6" />
  </div>

  <div v-else>
    <SendInvite class="mb-6" @sendInvite="loadData" />

    <Card>
      <template v-slot:title>{{ $t(`invites.invites`) }}</template>

      <template v-slot:content>
        <v-data-table :headers="headers" :items="invites" :items-per-page="5">
          <template v-slot:item.status="{ item }">
            <v-chip class="ma-2" :color="colors[item.status]" label>{{
              $t(`invites.statuses.${item.status}`)
            }}</v-chip>
          </template>

          <template v-slot:item.sent_at="{ item }">{{
            formatDate(item.sent_at)
          }}</template>
        </v-data-table>
      </template>
    </Card>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import moment from '~/plugins/moment'
import { getInvites, GroupInviteI } from '~/api/admin-invites.ts'
import { SnackbarsModule } from '~/store/snackbars.ts'

export interface TableHeader {
  value: string
  text: string
  sortable: boolean
}

/**
 * Компонент с списком приглашенных в группу
 */
@Component({
  components: {
    SendInvite: () => import('./send-invite.vue'),
    Loader: () =>
      import(
        '~/components/UI-core/loader.vue' /* webpackChunkName: 'components/UI-core/loader' */
      ),
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
    { text: 'Email', sortable: false, value: 'email' },
    { text: 'Статус', sortable: false, value: 'status' },
    { text: 'Отправлено', sortable: false, value: 'sent_at' }
  ]

  /**
   * Цвета статусов
   */
  colors: {
    pending: 'warning'
    accepted: 'success'
  }

  /**
   * Список приглашений
   */
  invites: GroupInviteI[] = []

  /**
   * Флаг загрузки
   */
  loading: boolean = true

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
      SnackbarsModule.ADD_SNACKBARS(error.snackbarErrors)
    }
  }

  /**
   * Форматировать дату
   * @param {String} date - дата
   * @returns {String}
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
