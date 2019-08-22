<template>
  <v-card min-height="100" elevation="5">
    <CardTitle>{{ event.title }}</CardTitle>

    <v-card-text class="pb-0">
      <div>
        <template v-if="event.description">
          <span class="font-weight-bold">{{ $t('field.description') }}:</span>
          <p>{{ event.description }}</p>
        </template>

        <div>{{ getCourseView(courseId) }}</div>
      </div>
    </v-card-text>

    <v-card-actions class="pt-0">
      <v-btn icon class="text-primary">
        <v-icon>star_half</v-icon>
      </v-btn>

      <v-btn icon class="text-primary">
        <v-icon>work</v-icon>
      </v-btn>

      <v-btn icon class="text-primary" @click="edit">
        <v-icon>edit</v-icon>
      </v-btn>

      <v-spacer></v-spacer>

      <DeleteButton
        :id="id"
        :disabled="updating"
        :namespace="namespace"
        :action="deleteAction"
        :confirm-text="$t('events.confirm')"
      />
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
      ),
    DeleteButton: () =>
      import(
        '../UI-core/delete-button.vue' /* webpackChunkName: 'components/UI-core/delete-button' */
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
     * Элмент расписания
     * @type {Object}
     */
    event: {
      type: Object,
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
     * Список предметов
     * @type {Array}
     */
    courses: {
      type: Array,
      required: true
    },

    /**
     * Флаг обновления
     * @type {Boolean}
     */
    updating: {
      type: Boolean,
      required: true
    },

    /**
     * Namespace модуля с расписанием
     * @type {String}
     */
    namespace: {
      type: String,
      required: true
    },

    /**
     * Action на удаление элемента расписания
     * @type {Strings}
     */
    deleteAction: {
      type: String,
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
    },

    edit() {
      this.$emit('edit', { id: this.id, model: this.event })
    }
  }
}
</script>
