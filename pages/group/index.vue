<template>
  <v-skeleton-loader
    v-if="loading"
    :height="500"
    type="table"
    class="elevation-2"
  />

  <div v-else>
    <Card class="group__wrapper">
      <template v-slot:content>
        <v-data-table
          :headers="headers"
          :items="students"
          :items-per-page="10"
          :footer-props="footerProps"
          :single-expand="true"
          :expanded.sync="expanded"
          show-expand
        >
          <template #item.full_name="{ item }">
            <span class="table-row-title">{{
              item.full_name || item.email
            }}</span>
          </template>

          <template #expanded-item="{ headers, item }">
            <td :colspan="headers.length">
              <div class="group__info">
                <v-img src="/images/writer.png" width="100" max-width="100" />

                <div class="group__contact">
                  <div>{{ $t('field.about') }}: {{ item.about || '-' }}</div>
                  <div>{{ $t('field.phone') }}: {{ item.phone || '-' }}</div>
                  <template v-for="social_network in item.social_networks">
                    <div v-if="social_network" :key="social_network.network">
                      {{ social_network.network }}: {{ social_network.url }}
                    </div>
                  </template>
                </div>
              </div>
            </td>
          </template>
        </v-data-table>
      </template>
    </Card>
  </div>
</template>

<script lang="ts">
import {
  reactive,
  onMounted,
  toRefs,
  computed,
  defineComponent
} from '@vue/composition-api'
import { getGroupUsers, Student } from '~/api/group-users.ts'
import { useDataTableFooterProps } from '~/compositions/useDataTableFooterProps.ts'

interface StateI {
  /** Строка поиска */
  search: string
  /** Флаг загрузки */
  loading: Boolean
  /** Список студентов */
  students: Student[]
  /**  Список открытых строк таблицы */
  expanded: Student[]
}

export default defineComponent({
  name: 'GroupPage',
  components: {
    Card: () =>
      import(
        '~/components/UI-core/card.vue' /* webpackChunkName: 'components/UI-core/card' */
      ),
    ModalWrapper: () =>
      import(
        '~/components/modal/modal-wrapper.vue' /*  webpackChunkName: 'components/modal/modal-wrapper' */
      )
  },
  setup(_, context) {
    /** Состояние */
    const state = reactive<StateI>({
      search: '',
      loading: true,
      students: [],
      expanded: []
    })

    /** Настройки для пагинации с локализацией */
    const footerProps = useDataTableFooterProps(context)

    /** Заголовки таблицы */
    const headers = computed(() => [
      {
        text: context.root.$t('field.fullName'),
        sortable: false,
        value: 'full_name'
      },
      {
        text: 'Email',
        sortable: false,
        value: 'email'
      }
    ])

    /** Загрузить список студентов */
    const loadData = async () => {
      try {
        state.students = await getGroupUsers()
        state.loading = false
      } catch (error) {
        context.root.$vuexModules.Snackbars.ADD_SNACKBARS(error.snackbarErrors)
      }
    }

    onMounted(() => loadData())

    return { ...toRefs(state), footerProps, headers }
  }
})
</script>

<style scoped>
.group__info {
  padding: 15px;
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.group__contact {
  margin-left: 15px;
}
</style>
