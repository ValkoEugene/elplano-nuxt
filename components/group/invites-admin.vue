<template>
  <v-card>
    <!-- eslint-disable -->
    <v-card-title>{{ $t(`invites.invites`) }}</v-card-title>

    <v-card-text>
      <!-- eslint-disable -->
      <v-data-table :headers="headers" :items="invites" :items-per-page="5">
        <template v-slot:item.status="{ item }">
          <v-chip
            class="ma-2"
            :color="colors[item.status]"
            label
          >{{ $t(`invites.statuses.${item.status}`) }}</v-chip>
        </template>

        <template v-slot:item.sent_at="{ item }">{{ formatDate(item.sent_at )}}</template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { namespace, Types } from '../../store/invites/group-invites'
import moment from '../../plugins/moment'

export default {
  name: 'InvitesList',
  data: () => ({
    /**
     * Заголовки таблицы
     * @type {Array}
     */
    headers: [
      { text: 'Email', sortable: false, value: 'email' },
      { text: 'Статус', sortable: false, value: 'status' },
      { text: 'Отправлено', sortable: false, value: 'sent_at' }
    ],

    /**
     * Цвета статусов
     * @type {Object}
     */
    colors: {
      pending: 'warning',
      accepted: 'success'
    }
  }),
  computed: {
    ...mapState(namespace, [
      /**
       * Флаг загрузки
       * @type {Boolean}
       */
      'loading',
      /**
       * Флаг обновления
       * @type {Boolean}
       */
      'updating',
      /**
       * Список приглашений
       * @type {Array}
       */
      'invites'
    ])
  },
  mounted() {
    this.loadData()
  },
  methods: {
    ...mapActions(namespace, {
      /**
       * Загрузить список приглашения
       */
      loadData: Types.actions.LOAD_INVITES
    }),

    /**
     * Форматировать дату
     * @param {String} date - дата
     * @returns {String}
     */
    formatDate(date) {
      return date ? moment(date).format('DD.MM.YYYY') : '-'
    }
  }
}
</script>

<style>
.v-data-table-header.v-data-table-header-mobile {
  display: none;
}
</style>
