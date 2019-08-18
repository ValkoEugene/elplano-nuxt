<template>
  <v-card>
    <v-toolbar dark color="primary">
      <v-btn icon dark @click="close">
        <v-icon>close</v-icon>
      </v-btn>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <!-- eslint-disable -->
        <v-btn
          dark
          text
          :disabled="updating"
          @click="$refs.form.validate() && save()"
        >{{ $t('actions.save') }}</v-btn>
      </v-toolbar-items>
    </v-toolbar>

    <v-card-text class="pa-6">
      <v-form ref="form" :lazy-validation="true">
        <v-text-field
          v-model.trim="localLecturer.last_name"
          :label="$t('field.lastName')"
          :placeholder="$t('field.lastName')"
          :rules="[$rules.required]"
          type="text"
          outlined
        />

        <v-text-field
          v-model.trim="localLecturer.first_name"
          :label="$t('field.firstName')"
          :placeholder="$t('field.firstName')"
          :rules="[$rules.required]"
          type="text"
          outlined
        />

        <v-text-field
          v-model.trim="localLecturer.patronymic"
          :label="$t('field.patronymic')"
          :placeholder="$t('field.patronymic')"
          :rules="[$rules.required]"
          type="text"
          outlined
        />

        <v-select
          v-model="localLecturer.course_ids"
          :items="courses"
          item-value="id"
          item-text="title"
          :label="$t('lesson.lessons')"
          outlined
          attach
          chips
          multiple
        />
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script>
import clonedeep from 'lodash.clonedeep'
import { mapState, mapActions } from 'vuex'
import {
  namespace as lecturersNamespace,
  Types as lecturersTypes
} from '../../store/lecturers'

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
     * Id редактируемого преподавателя
     * @type {Boolean}
     */
    editingId: {
      type: String,
      default: ''
    }
  },
  data: () => ({
    /**
     * Локальная копия преподавателя
     * @type {Object}
     */
    localLecturer: {
      id: '',
      first_name: '',
      last_name: '',
      patronymic: '',
      avatar: '',
      course_ids: []
    }
  }),
  computed: {
    ...mapState(lecturersNamespace, [
      /**
       * Флаг обновления
       * @type {Boolean}
       */
      'updating'
    ])
  },
  watch: {
    editingId() {
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
      if (!this.editingId) return

      this.localLecturer = clonedeep(
        this.lecturers.find((item) => item.id === this.editingId)
      )
    },

    /**
     * Закрыть редактрование
     * @type {Function}
     */
    close() {
      this.$emit('close')
    },

    ...mapActions(lecturersNamespace, {
      /**
       * Обновить преподавателя
       * @type {Function}
       */
      update: lecturersTypes.actions.EDIT_LECTURER,
      /**
       * Создать преподавателя
       * @type {Function}
       */
      create: lecturersTypes.actions.CREATE_LECTURER
    }),

    /**
     * Сохранение
     * @type {Function}
     */
    save() {
      this.editingId
        ? this.update(this.localLecturer)
        : this.create(this.localLecturer)
    }
  }
}
</script>
