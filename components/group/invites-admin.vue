<template>
  <div v-if="loading" class="invites-admin__loaders">
    <v-skeleton-loader
      :height="192"
      type="article"
      class="send-invite__loader mb-6 elevation-2"
    />

    <v-skeleton-loader
      :height="275"
      type="table"
      class="invites-table__loader elevation-2"
    />
  </div>

  <div v-else>
    <SendInvite class="mb-6" @sendInvite="loadData" />

    <Card>
      <template v-slot:title>{{ $t(`invites.invites`) }}</template>

      <template v-slot:content>
        <v-data-table
          :headers="headers"
          :items="invites"
          :items-per-page="5"
          :footer-props="footerProps"
        >
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
import {
  defineComponent,
  computed,
  reactive,
  toRefs,
  onMounted
} from '@vue/composition-api'
import moment from '~/plugins/moment'
import { getInvites, GroupInviteI } from '~/api/admin-invites.ts'
import { useDataTableFooterProps } from '~/compositions/useDataTableFooterProps.ts'

interface StateI {
  /** Список приглашений */
  invites: GroupInviteI[]
  /** Флаг загрузки */
  loading: boolean
}

export interface TableHeader {
  value: string
  text: any
  sortable: boolean
}

export default defineComponent({
  components: {
    SendInvite: () => import('./send-invite.vue'),
    Card: () =>
      import(
        '~/components/UI-core/card.vue' /* webpackChunkName: 'components/UI-core/card' */
      )
  },
  setup(_, context) {
    const state = reactive<StateI>({
      invites: [],
      loading: true
    })

    /** Заголовки таблицы */
    const headers = computed<TableHeader[]>(() => {
      return [
        { text: 'Email', sortable: false, value: 'email' },
        {
          text: context.root.$t('ui.status'),
          sortable: false,
          value: 'status'
        },
        { text: context.root.$t('ui.send'), sortable: false, value: 'sent_at' }
      ]
    })

    /** Цвета статусов */
    const colors = {
      pending: 'warning',
      accepted: 'success'
    }

    /** Загрузить список приглашений */
    const loadData = async () => {
      try {
        state.invites = await getInvites()
        state.loading = false
      } catch (error) {
        context.root.$vuexModules.Snackbars.ADD_SNACKBARS(error.snackbarErrors)
      }
    }
    onMounted(() => loadData())

    /** Форматировать дату */
    const formatDate = (date: string): string => {
      return date ? moment(date).format('DD.MM.YYYY') : '-'
    }

    const footerProps = useDataTableFooterProps(context)

    return {
      headers,
      colors,
      ...toRefs(state),
      formatDate,
      loadData,
      footerProps
    }
  }
})
</script>

<style>
.v-data-table-header.v-data-table-header-mobile {
  display: none;
}

.invites-admin__loaders .send-invite__loader > div:first-child {
  height: 192px;
}

.invites-admin__loaders .invites-table__loader > div:first-child {
  height: 275px;
}
</style>
