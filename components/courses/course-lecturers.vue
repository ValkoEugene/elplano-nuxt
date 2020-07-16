<template>
  <div class="course__lecturers-list">
    <v-skeleton-loader
      v-if="loadCourseInfo"
      type="list-item-avatar-three-line"
    />

    <div v-else-if="!showenModel.lecturers.length">
      {{ $t('lecturers.empty') }}
    </div>

    <div v-else class="course-lecturers__content">
      <v-list>
        <div
          v-for="(lecturer, index) in showenModel.lecturers"
          :key="lecturer.id"
        >
          <v-divider v-if="index !== 0" inset />

          <v-list-item>
            <v-list-item-avatar>
              <!-- TODO прикрепляемые изображения -->
              <v-img src="/images/professor.png"></v-img>
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title>
                <v-chip v-if="lecturer.active" class="mb-2" color="info" label>
                  {{ $t('ui.card.badges.active') }}
                </v-chip>

                <div>{{ lecturer.view }}</div>
              </v-list-item-title>

              <v-list-item-subtitle>
                <div>phone: {{ lecturer.phone || '-' }}</div>

                <div>email: {{ lecturer.emai || '-' }}</div>
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </div>
      </v-list>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  toRefs,
  reactive,
  onMounted
} from '@vue/composition-api'
import { CourseShow, courseApi } from '~/api/courses.ts'

interface StateI {
  /** Флаг загрузки информации о предмете */
  loadCourseInfo: Boolean
  /** Модель предмета на просмотр */
  showenModel: CourseShow | null
}

interface PropsI {
  /** ID предмета */
  courseId: string
}

export default defineComponent({
  name: 'CurseLecturers',
  components: {
    Card: () =>
      import(
        '~/components/UI-core/card.vue' /* webpackChunkName: 'components/UI-core/card' */
      )
  },
  props: {
    courseId: {
      type: String,
      required: true
    }
  },
  setup(props: PropsI, context) {
    const vuexModules = context.root.$vuexModules

    const state = reactive<StateI>({
      loadCourseInfo: true,
      showenModel: null
    })

    /** Посмотреть предмет */
    const show = async () => {
      try {
        state.showenModel = null
        state.loadCourseInfo = true
        state.showenModel = await courseApi.show(props.courseId)
      } catch (error) {
        vuexModules.Snackbars.ADD_SNACKBARS(error.snackbarErrors)
      } finally {
        state.loadCourseInfo = false
      }
    }

    onMounted(() => {
      show()
    })

    return {
      ...toRefs(state),
      show
    }
  }
})
</script>

<style scoped>
.course__lecturers-list {
  padding: 15px;
}
</style>
