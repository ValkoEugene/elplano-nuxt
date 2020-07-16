<template>
  <div class="content">
    <div v-if="loadInfo" class="lecturer__skeletons">
      <div class="lecturer__info">
        <v-skeleton-loader type="avatar" :width="100" :height="100" />

        <div class="lecturer__contact">
          <v-skeleton-loader type="list-item" :width="200" />
          <v-skeleton-loader type="list-item" :width="200" />
        </div>
      </div>

      <v-skeleton-loader type="list-item" />
    </div>

    <template v-else>
      <div class="lecturer__info">
        <v-img src="/images/professor.png" width="100" max-width="100" />

        <div class="lecturer__contact">
          <div>{{ $t('field.phone') }}: {{ showenModel.phone || '-' }}</div>
          <div>email: {{ showenModel.email || '-' }}</div>
        </div>
      </div>

      <div v-if="!showenModel.course_ids.length">
        {{ $t('lesson.empty') }}
      </div>

      <div v-else>
        <v-list two-line>
          <v-subheader class="lessons__subheader">{{
            $t('lesson.lessons')
          }}</v-subheader>

          <div v-for="(course, index) in showenModel.courses" :key="course.id">
            <v-divider v-if="index !== 0" inset />

            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>
                  <v-chip v-if="course.active" class="mb-2" color="info" label>
                    {{ $t('ui.card.badges.active') }}
                  </v-chip>

                  <div>{{ course.title }}</div>
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </div>
        </v-list>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  toRefs,
  reactive,
  onMounted
} from '@vue/composition-api'
import { LecturerShow, lecturersApi } from '~/api/lecturers.ts'
import { CourseIndex } from '~/api/courses.ts'

interface StateI {
  /** Флаг загрузки информации о преподавателе */
  loadInfo: Boolean
  /** Модель преподавателя на просмотр */
  showenModel: LecturerShow | null
}

interface PropsI {
  /** ID преподавателя */
  lecturerId: string
  /** Список всех предметов */
  courses: CourseIndex[]
}

export default defineComponent({
  name: 'LecturerCourses',
  components: {
    Card: () =>
      import(
        '~/components/UI-core/card.vue' /* webpackChunkName: 'components/UI-core/card' */
      )
  },
  props: {
    lecturerId: {
      type: String,
      required: true
    },
    courses: {
      type: Array,
      required: true
    }
  },
  setup(props: PropsI, context) {
    const vuexModules = context.root.$vuexModules

    const state = reactive<StateI>({
      loadInfo: true,
      showenModel: null
    })

    /** Посмотреть предмет */
    const show = async () => {
      try {
        state.showenModel = null
        state.loadInfo = true
        state.showenModel = await lecturersApi.show(props.lecturerId)
        const courses = state.showenModel.course_ids
          .map((courseId) =>
            props.courses.find((course) => course.id === courseId)
          )
          .filter(Boolean)
        state.showenModel.courses = courses as CourseIndex[]
      } catch (error) {
        vuexModules.Snackbars.ADD_SNACKBARS(error.snackbarErrors)
      } finally {
        state.loadInfo = false
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
.content {
  padding: 15px;
}

.lecturer__info {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.lecturer__contact {
  margin-left: 15px;
}

.lessons__subheader {
  height: 20px;
}
</style>

<style>
.lecturer__skeletons .v-skeleton-loader__avatar.v-skeleton-loader__bone {
  height: 100px;
  width: 100px;
}
</style>
