<template>
  <div>
    test
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import CoursesList from '~/mixins/CoursesList.ts'
import LecturersList from '~/mixins/LecturersList.ts'

@Component
export default class TestPage extends Mixins(CoursesList, LecturersList) {
  get loading(): boolean {
    return this.loadingCourses && this.loadingLecturers
  }

  mounted() {
    console.log('mounted TestPage')
  }
}
</script>
