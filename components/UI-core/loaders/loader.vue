<template>
  <div v-if="contentWidth" class="loader_wrapper">
    <v-skeleton-loader
      v-if="showSearch"
      height="50"
      type="list-item"
      class="loader__search elevation-2"
    />

    <content-loader
      v-if="showForm"
      :height="(formInputsCount + 2) * 86"
      :width="contentWidth - 24"
      :speed="2"
      :primary-color="primaryColor"
      :secondary-color="secondaryColor"
    >
      <rect x="15" y="15" :width="contentWidth / 2" :height="30" />
      <rect
        v-for="i in formInputsCount"
        :key="i"
        x="15"
        :y="i * 86"
        :width="contentWidth"
        :height="56"
      />
      <rect
        x="15"
        :y="15 + (formInputsCount + 1) * 75 + 25"
        :width="150"
        :height="52"
      />
    </content-loader>

    <v-layout v-if="showCards" row wrap class="loader__cards--wrapper">
      <!-- eslint-disable-next-line -->
      <template v-for="n in [1, 2, 3, 4, 5, 6]">
        <v-flex :key="n" xs12 sm12 md4 class="pa-3">
          <v-skeleton-loader
            :key="n"
            :height="isMobile ? 165 : 200"
            type="article"
            class="elevation-2"
          />
        </v-flex>

        <!-- eslint-disable-next-line -->
        <!-- <FacebookLoader
          :key="n"
          :height="200"
          :width="
            isMobile
              ? contentWidth
              : (contentWidth - sidebarWidth - 50 - 20) / 3
          "
          :style="{ width: isMobile ? '100%' : '33%' }"
          class="loader_card"
          :primary-color="primaryColor"
          :secondary-color="secondaryColor"
        /> -->
      </template>
    </v-layout>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { ContentLoader, FacebookLoader } from 'vue-content-loader'

@Component({
  components: {
    FacebookLoader,
    ContentLoader
  }
})
export default class Loader extends Vue {
  /**
   * Показывать лоудер для строки поиска
   * @type {Boolean}
   */
  @Prop({ type: Boolean, default: false })
  readonly showSearch!: boolean

  /**
   * Показывать лоудер для карточек
   * @type {Boolean}
   */
  @Prop({ type: Boolean, default: false })
  readonly showCards!: boolean

  /**
   * Показывать лоудер для формы
   * @type {Boolean}
   */
  @Prop({ type: Boolean, default: false })
  readonly showForm!: boolean

  /**
   * Количество инпутов у лоудера формы
   * @type {Number}
   */
  @Prop({ type: Number, default: 6 })
  readonly formInputsCount!: number

  /**
   * Длина контента
   * @type {Number}
   */
  contentWidth: number = 0

  /**
   * Длина бокового меню
   * @type {Number}
   */
  sidebarWidth: number = 256

  /**
   * Флаг просмотра через смартфоны
   * @type {Boolean}
   */
  isMobile: boolean = false

  /**
   * Цвета
   */
  primaryColor: string = '#e6e6e6'
  secondaryColor: string = '#d8d8d8'

  mounted() {
    this.isMobile = this.$vuetify.breakpoint.smAndDown

    this.contentWidth = this.$vuetify.breakpoint.width
  }
}
</script>

<style scoped>
.loader__search {
  height: 50px;
  width: 100%;
  margin-bottom: 16px;
}
</style>

<style>
.loader__cards--wrapper .v-skeleton-loader__article.v-skeleton-loader__bone {
  height: 200px;
}
</style>
