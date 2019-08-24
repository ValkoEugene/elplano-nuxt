<template>
  <v-card>
    <v-card-title>{{ $t('student.title') }}</v-card-title>

    <v-card-text>
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
import { namespace, Types } from '../../store/user'
import checkGroup from '../../mixins/checkgroup'

export default {
  name: 'StudentPage',
  mixins: [checkGroup],
  data: () => ({
    /**
     * Локальнкая копия информации о студенте
     * @type {Object}
     */
    localStudent: { social_networks: {} }
  }),
  computed: {
    ...mapState(namespace, [
      /**
       * Флаг обновления
       */
      'updating',
      /**
       * Информация о студенте
       */
      'studentInfo'
    ])
  },
  watch: {
    studentInfo() {
      this.localStudent = clonedeep(this.studentInfo)
    }
  },
  mounted() {
    this.localStudent = clonedeep(this.studentInfo)
  },
  methods: {
    ...mapActions(namespace, {
      /**
       * Обновить информацию о студенте
       * @type {Funciton}
       */
      updateStudent: Types.actions.UPDATE_STUDENT
    })
  }
}
</script>
