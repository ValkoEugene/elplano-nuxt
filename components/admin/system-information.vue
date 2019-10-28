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
      <Card class="info__item">
        <template v-slot:title>
          System resources
        </template>

        <template v-slot:content>
          <div>cpu_cores: {{ cpu_cores }}</div>
          <div class="info__item--memory">
            memory_usage:
            <p>active {{ memory_usage.active_bytes | convertBytesToGb }}</p>
            <p>total {{ memory_usage.total_bytes | convertBytesToGb }}</p>
          </div>
        </template>
      </Card>

      <div class="items__wrapper">
        <Card
          v-for="disk in disks_usage"
          :key="disk.mount_path"
          class="info__item"
        >
          <template v-slot:title>
            {{ disk.mount_path }}
          </template>

          <template v-slot:content>
            <div>disk_name: {{ disk.disk_name }}</div>
            <div class="info__item--memory">
              memory_usage:
              <p>active {{ disk.active_bytes | convertBytesToGb }}</p>
              <p>total {{ disk.total_bytes | convertBytesToGb }}</p>
            </div>
          </template>
        </Card>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { getSystemInformation, DisksUsage, MemoryUsage } from '~/api/admin.ts'
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
  },
  filters: {
    /**
     * Конвертировать байты в гигобайты
     * @param {number}
     * @returns {string}
     */
    convertBytesToGb(value: any): string {
      return !value || typeof value !== 'number'
        ? '-'
        : Math.round((value / 1e9) * 10) / 10 + ' Gb'
    }
  }
})
export default class AdminSystemInformation extends Vue {
  /**
   * Флаг загрузки
   * @type {boolean}
   */
  loading: boolean = true

  /**
   * Количетсво ядер
   * @type {number}
   */
  cpu_cores: number = 0

  /**
   * Память
   * @type {MemoryUsage}
   */
  memory_usage: MemoryUsage = {
    active_bytes: 0,
    total_bytes: 0
  }

  /**
   * @type {DisksUsage[]}
   */
  disks_usage: DisksUsage[] = []

  /**
   * Флаг наличия информации
   * @type {boolean}
   */
  haveInfo: boolean = false

  mounted() {
    this.loadData()
  }

  /**
   * Загрузить данные
   * @type {Function}
   */
  async loadData(): Promise<void> {
    try {
      const response = await getSystemInformation()
      if (response === null || (Array.isArray(response) && !response.length)) {
        this.haveInfo = false
      } else {
        const { cpu_cores, memory_usage, disks_usage } = response
        this.cpu_cores = cpu_cores
        this.memory_usage = memory_usage
        this.disks_usage = disks_usage
        this.haveInfo = true
      }

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

.info__item--memory p {
  margin: 0;
  padding-left: 10px;
}
</style>
