<template>
  <v-card>
    <v-toolbar dark color="primary">
      <v-btn icon dark @click="close">
        <v-icon>close</v-icon>
      </v-btn>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <!-- eslint-disable -->
        <v-btn dark text :disabled="updating" @click="save">{{ $t('actions.save') }}</v-btn>
      </v-toolbar-items>
    </v-toolbar>

    <v-card-text>
      <v-text-field
        v-model="localCourse.title"
        :label="$t('field.title')"
        :placeholder="$t('field.title')"
        type="text"
        outlined
      />
    </v-card-text>
  </v-card>
</template>

<script>
import clonedeep from 'lodash.clonedeep'
import { mapState, mapActions } from 'vuex'
import {
  namespace as coursesNamespace,
  Types as coursesTypes
} from '../../store/courses'

export default {
  name: 'EditLesson',
  props: {
    /**
     * Преподаватели
     * @type {Object}
     */
    lecturers: {
      type: Object,
      default: () => ({})
    },

    /**
     * Предметы
     * @type {Object}
     */
    courses: {
      type: Object,
      default: () => ({})
    },

    /**
     * Id редактируемого предмета
     * @type {Boolean}
     */
    coursesId: {
      type: String,
      default: ''
    }
  },
  data: () => ({
    /**
     * Локальная копия предмета
     * @type {Object}
     */
    localCourse: {}
  }),
  computed: {
    ...mapState(coursesNamespace, [
      /**
       * Флаг обновления
       * @type {Boolean}
       */
      'updating'
    ])
  },
  mounted() {
    if (this.coursesId && this.courses[this.coursesId]) {
      this.localCourse = clonedeep(this.courses[this.coursesId])
    }
  },
  methods: {
    /**
     * Закрыть редактрование
     */
    close() {
      this.$emit('close')
    },

    ...mapActions(coursesNamespace, {
      /**
       * Обновить курс
       * @type {Function}
       */
      update: coursesTypes.actions.EDIT_COURSE,
      /**
       * Создать курс
       * @type {Function}
       */
      create: coursesTypes.actions.CREATE_COURSE
    }),

    /**
     * Сохранение
     * @type {Function}
     */
    save() {
      this.coursesId
        ? this.update(this.localCourse)
        : this.create(this.localCourse)
    }
  }
}
</script>
