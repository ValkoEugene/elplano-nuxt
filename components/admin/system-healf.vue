<template>
  <div>
    <Loader
      v-if="loading"
      :show-form="true"
      :form-inputs-count="4"
      class="mb-6"
    />

    <v-alert v-else-if="!haveInfo" type="error" prominent>
      <span> Information can not be received. </span>
    </v-alert>

    <template v-else>
      <div class="items__wrapper">
        <Card
          v-for="(item, item_key) in info"
          :key="item_key"
          class="info__item"
        >
          <template v-slot:title>
            {{ item_key }}
          </template>

          <template v-slot:content>
            <p
              v-for="(detail, detail_key) in item"
              :key="detail_key"
              class="info__item--details"
            >
              <span>{{ detail_key }}:</span>
              {{ info[item_key][detail_key] || '-' }}
            </p>
          </template>
        </Card>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { getSystemHealth, SystemHealth } from '~/api/admin.ts'
import { SnackbarsModule } from '~/store/snackbars.ts'

@Component({
  components: {
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
export default class AdminSystemHealf extends Vue {
  /**
   * Флаг загрузки
   * @type {Boolean}
   */
  loading: boolean = true

  /**
   * Информация о состояние системы
   * @type {SystemHealth}
   */
  info: SystemHealth = {
    db_check: {
      status: null,
      message: null,
      labels: null
    },
    redis_check: {
      status: null,
      message: null,
      labels: null
    },
    cache_check: {
      status: null,
      message: null,
      labels: null
    },
    queues_check: {
      status: null,
      message: null,
      labels: null
    }
  }

  /**
   * Флаг наличия информации
   * @type {Boolean}
   */
  get haveInfo(): boolean {
    return this.info && Object.keys(this.info).length > 0
  }

  mounted() {
    this.loadData()
  }

  /**
   * Загрузить данные
   * @type {Function}
   */
  async loadData(): Promise<void> {
    try {
      this.info = await getSystemHealth()

      this.loading = false
    } catch (error) {
      SnackbarsModule.ADD_SNACKBARS(error.snackbarErrors)
    }
  }
}
</script>

<style scoped>
.items__wrapper {
  display: flex;
}

.info__item {
  width: 25%;
  padding: 15px;
  margin: 20px;
}

.info__item--title {
  font-size: 24px;
  font-weight: 500;
}

.info__item--details {
  margin: 0;
}
</style>
