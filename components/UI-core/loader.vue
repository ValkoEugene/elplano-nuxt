<template>
  <div v-if="contentWidth" class="loader_wrapper">
    <content-loader
      v-if="showSearch"
      :height="50"
      :width="isMobile ? contentWidth : contentWidth - sidebarWidth"
      :speed="2"
      :primary-color="primaryColor"
      :secondary-color="secondaryColor"
      class="loader__search px-3 mb-4"
    >
      <rect x="0" y="0" rx="0" ry="0" :width="contentWidth" :height="50" />
    </content-loader>

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

    <div v-if="showCards" class="loader__cards--wrapper">
      <!-- eslint-disable-next-line -->
      <template v-for="n in [1, 2, 3, 4, 5, 6]">
        <!-- eslint-disable-next-line -->
        <FacebookLoader
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
        />
      </template>
    </div>
  </div>
</template>

<script>
import { ContentLoader, FacebookLoader } from 'vue-content-loader'

export default {
  name: 'Loader',
  components: {
    FacebookLoader,
    ContentLoader
  },
  props: {
    /**
     * Показывать лоудер для строки поиска
     * @type {Boolean}
     */
    showSearch: {
      type: Boolean,
      default: false
    },

    /**
     * Показывать лоудер для карточек
     * @type {Boolean}
     */
    showCards: {
      type: Boolean,
      default: false
    },

    /**
     * Показывать лоудер для формы
     * @type {Boolean}
     */
    showForm: {
      type: Boolean,
      default: false
    },

    /**
     * Количество инпутов у лоудера формы
     * @type {Number}
     */
    formInputsCount: {
      type: Number,
      default: 6
    }
  },
  data: () => ({
    /**
     * Длина контента
     * @type {Number}
     */
    contentWidth: 0,

    /**
     * Длина бокового меню
     * @type {Number}
     */
    sidebarWidth: 256,

    /**
     * Флаг просмотра через смартфоны
     * @type {Boolean}
     */
    isMobile: false,

    /**
     * Цвета
     */
    primaryColor: '#e6e6e6',
    secondaryColor: '#d8d8d8'
  }),
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
}

.loader__cards--wrapper {
  display: flex;
  flex-wrap: wrap;
}

.loader_card {
  padding: 12px;
}
</style>
