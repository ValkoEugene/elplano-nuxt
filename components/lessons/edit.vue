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

    <v-card-text class="pa-6">
      <v-text-field
        v-model="localCourse.title"
        :label="$t('field.title')"
        :placeholder="$t('field.title')"
        type="text"
        outlined
      />

      <v-select
        v-model="localCourse.lecturer_ids"
        :items="lecturers"
        item-value="id"
        item-text="view"
        :label="$t('lecturers.lecturers')"
        outlined
        attach
        chips
        multiple
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
     * @type {Array}
     */
    lecturers: {
      type: Array,
      default: () => []
    },

    /**
     * Предметы
     * @type {Array}
     */
    courses: {
      type: Array,
      default: () => []
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
    localCourse: {
      id: '',
      title: '',
      lecturer_ids: []
    }
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
  watch: {
    coursesId() {
      this.createLocalCopy()
    }
  },
  mounted() {
    this.createLocalCopy()
  },
  methods: {
    /**
     * Создать локальную копию предмета
     * @type {Function}
     */
    createLocalCopy() {
      if (!this.coursesId) return

      this.localCourse = clonedeep(
        this.courses.find((item) => item.id === this.coursesId)
      )
    },

    /**
     * Закрыть редактрование
     * @type {Function}
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
