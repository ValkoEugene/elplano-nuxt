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

<script>
import { mapState, mapActions } from 'vuex'
import { namespace, Types } from '~/store/invites/user-invites'
import moment from '~/plugins/moment'

export default {
  name: 'InvitesList',
  components: {
    Card: () =>
      import(
        '~/components/UI-core/card.vue' /* webpackChunkName: 'components/UI-core/card' */
      )
  },
  data: () => ({
    /**
     * Заголовки таблицы
     * @type {Array}
     */
    headers: [
      { text: 'Группа', sortable: false, value: 'group_title' },
      { text: 'Номер', sortable: false, value: 'group_number' },
      { text: 'Отправлено', sortable: false, value: 'sent_at' },
      { value: 'invitation_token', width: '150px' }
    ]
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
      loadData: Types.actions.LOAD_INVITES,
      /**
       * Принять приглашение
       */
      accept: Types.actions.ACCEPT_INVITE
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
