<template>
  <v-card min-height="100" elevation="5">
    <CardTitle>{{ title }}</CardTitle>

    <v-card-text class="pb-0">
      <div>
        <template v-if="description">
          <span class="font-weight-bold">{{ $t('field.description') }}:</span>
          <p>{{ description }}</p>
        </template>

        <div>{{ getCourseView(id) }}</div>
      </div>
    </v-card-text>

    <v-card-actions class="pt-0">
      <v-btn icon class="text-primary">
        <v-icon>star_half</v-icon>
      </v-btn>

      <v-btn icon class="text-primary">
        <v-icon>work</v-icon>
      </v-btn>

      <v-btn icon class="text-primary">
        <v-icon>edit</v-icon>
      </v-btn>

      <v-spacer></v-spacer>

      <v-btn icon color="error">
        <v-icon>delete</v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: 'EventCard',
  components: {
    CardTitle: () =>
      import(
        '../../components/cards/card-title.vue' /* webpackChunkName: 'components/cards/card-title' */
      )
  },
  props: {
    /**
     * Id элемента расписания
     * @type {String}
     */
    id: {
      type: String,
      required: true
    },

    /**
     * Заголовок
     * @type {String}
     */
    title: {
      type: String,
      required: true
    },

    /**
     * Id предмета к которому привязан элемент расписани
     * @type {String}
     */
    courseId: {
      type: String,
      required: true
    },

    /**
     * Описание
     * @type {String}
     */
    description: {
      type: String,
      default: ''
    },

    /**
     * Статус
     * @type {('confirmed' | 'tentative' | 'cancelled')}
     */
    status: {
      type: String,
      required: true
    },

    /**
     * Список предметов
     * @type {Array}
     */
    courses: {
      type: Array,
      required: true
    }
  },
  methods: {
    /**
     * Получить отображение предмета
     * @type {Function}
     * @param {String} id
     * @returns {String}
     */
    getCourseView(id) {
      const course = this.courses.find((item) => item.id === id)

      return course ? course.title : '-'
    }
  }
}
</script>
