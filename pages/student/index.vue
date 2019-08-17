<template>
  <v-card>
    <v-card-title>{{ $t('student.title') }}</v-card-title>

    <v-card-text v-if="!loading">
      <v-text-field
        v-model="localStudent.full_name"
        :label="$t('field.fullName')"
        :placeholder="$t('field.fullName')"
        type="text"
        outlined
      />

      <v-text-field
        v-model="localStudent.email"
        label="Email"
        placeholder="Email"
        type="text"
        :rules="[$rules.email]"
        outlined
      />

      <v-text-field
        v-model="localStudent.phone"
        :label="$t('field.phone')"
        :placeholder="$t('field.phone')"
        type="number"
        outlined
      />

      <v-text-field
        v-model="localStudent.about"
        :label="$t('field.about')"
        :placeholder="$t('field.about')"
        type="text"
        outlined
      />

      <v-text-field
        v-model="localStudent.social_networks.facebook"
        label="Facebook"
        placeholder="Facebook"
        type="text"
        outlined
      />

      <v-text-field
        v-model="localStudent.social_networks.twitter"
        label="Twitter"
        placeholder="Twitter"
        type="text"
        outlined
      />
    </v-card-text>

    <v-card-actions>
      <!-- eslint-disable -->
      <v-btn
        color="primary"
        :disabled="updating"
        @click="updateStudent(localStudent)"
      >{{ $t('actions.save') }}</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import clonedeep from 'lodash.clonedeep'
import { mapActions, mapState } from 'vuex'
import { namespace, Types } from '../../store/student'

export default {
  name: 'StudentPage',
  middleware: ['auth'],
  data: () => ({
    /**
     * Локальнкая копия информации о студенте
     * @type {Object}
     */
    localStudent: {}
  }),
  computed: {
    ...mapState(namespace, [
      /**
       * Флаг загрузки
       */
      'loading',
      /**
       * Флаг обновления
       */
      'updating',
      /**
       * Информация о студенте
       */
      'student'
    ])
  },
  watch: {
    student() {
      this.localStudent = clonedeep(this.student)
    }
  },
  mounted() {
    this.getStudent()
  },
  methods: {
    ...mapActions(namespace, {
      /**
       * Получить информацию о студенте
       */
      getStudent: Types.actions.GET_STUDENT,
      /**
       * Обновить информацию о студенте
       */
      updateStudent: Types.actions.UPDATE_STUDENT
    })
  }
}
</script>
