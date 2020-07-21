<template>
  <div class="course__lecturers-list">
    <template v-if="loadInfo">
      <v-skeleton-loader type="text" :width="150" />
      <v-skeleton-loader type="list-item-avatar-three-line" />
    </template>

    <div v-else-if="!showenModel.lecturers.length">
      {{ $t('lecturers.empty') }}
    </div>

    <div v-else class="course-lecturers__content">
      <v-list>
        <v-subheader class="courses__subheader">{{
          $t('lecturers.lecturers')
        }}</v-subheader>

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
                <div>
                  {{ lecturer.view }}
                  <v-icon
                    v-if="lecturer.active"
                    color="success"
                    class="active-icon"
                    small
                  >
                    check_circle_outline
                  </v-icon>
                </div>
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

    <div v-if="isPresident" class="courses__actions">
      <template v-if="loadInfo">
        <v-skeleton-loader type="button" class="mr-2" />
        <v-skeleton-loader type="button" />
      </template>

      <template v-else>
        <v-btn class="mr-2" small color="primary" @click="edit">
          {{ $t('ui.edit') }}
        </v-btn>

        <v-btn text small color="error" @click="confirmDelete">
          {{ $t('ui.delete') }}
        </v-btn>
      </template>
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
import { useConfirmDelete } from '~/compositions/useConfirmDelete.ts'

interface StateI {
  /** Флаг загрузки информации о предмете */
  loadInfo: Boolean
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
      loadInfo: true,
      showenModel: null
    })

    /** Посмотреть предмет */
    const show = async () => {
      try {
        state.showenModel = null
        state.loadInfo = true
        state.showenModel = await courseApi.show(props.courseId)
      } catch (error) {
        vuexModules.Snackbars.ADD_SNACKBARS(error.snackbarErrors)
      } finally {
        state.loadInfo = false
      }
    }

    onMounted(() => {
      show()
    })

    /** Флаг что пользователь является старостой */
    const isPresident = context.root.$vuexModules.User.isPresident

    const { confirmDelete } = useConfirmDelete(context, {
      text: context.root.$t('lesson.confirm') as string,
      id: props.courseId
    })

    /** Редактировать преподавателя */
    const edit = () => {
      context.emit('onEdit')
    }

    return {
      ...toRefs(state),
      show,
      isPresident,
      confirmDelete,
      edit
    }
  }
})
</script>

<style scoped>
.courses__subheader {
  height: 20px;
}

.courses__actions {
  display: flex;
}
</style>
