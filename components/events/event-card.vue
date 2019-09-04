<template>
  <Card small>
    <template v-slot:title>{{ event.title }}</template>

    <template v-slot:menu>
      <!-- <v-btn icon class="text-primary" :disabled="true">
        <v-icon>star_half</v-icon>
      </v-btn>

      <v-btn icon class="text-primary" :disabled="true">
        <v-icon>work</v-icon>
      </v-btn> -->

      <EditButton
        :president-access="false"
        :disabled="updating"
        @click="edit"
      />

      <DeleteButton
        :id="id"
        :disabled="updating"
        :namespace="namespace"
        :action="deleteAction"
        :president-access="false"
        :confirm-text="$t('events.confirm')"
      />
    </template>
  </Card>
</template>

<script>
export default {
  name: 'EventCard',
  components: {
    Card: () =>
      import(
        '../UI-core/card.vue' /* webpackChunkName: 'components/UI-core/card' */
      ),
    DeleteButton: () =>
      import(
        '../UI-core/delete-button.vue' /* webpackChunkName: 'components/UI-core/delete-button' */
      ),
    EditButton: () =>
      import(
        '../UI-core/edit-button.vue' /* webpackChunkName: 'components/UI-core/edit-button' */
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
