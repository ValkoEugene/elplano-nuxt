<template>
  <v-container fluid>
    <v-layout row wrap>
      <!-- eslint-disable -->
      <v-flex v-for="(lecturer, id) in lecturers" :key="id" xs12 sm12 md6 class="pa-6">
        <v-card min-height="100">
          <v-card-text>
            <div class="title text-primary">{{ lecturer.view }}</div>

            <div>Предметы: -</div>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import {
  namespace as lecturersNamespace,
  Types as lecturersTypes
} from '../../store/lecturers'

export default {
  name: 'TeacherPage',
  middleware: ['auth'],
  computed: {
    ...mapState(lecturersNamespace, ['lecturers', 'loading', 'updating'])
  },
  mounted() {
    this.loadLecturers()
  },
  methods: {
    ...mapActions(lecturersNamespace, {
      loadLecturers: lecturersTypes.actions.LOAD_LECTURERS
    })
  }
}
</script>
