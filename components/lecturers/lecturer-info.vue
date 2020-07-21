<template>
  <div>
    <div class="lesson__content">
      <template v-if="loadInfo">
        <div class="lecturer__info lecturer__skeletons">
          <v-skeleton-loader
            type="avatar"
            :width="100"
            :min-width="100"
            :height="100"
          />

          <div class="lecturer__contact">
            <v-skeleton-loader type="list-item" :width="150" />
            <v-skeleton-loader type="list-item" :width="150" />
          </div>
        </div>

        <div>
          <v-skeleton-loader type="list-item-two-line" />
        </div>
      </template>

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

            <div
              v-for="(course, index) in showenModel.courses"
              :key="course.id"
            >
              <v-divider v-if="index !== 0" inset />

              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>
                    <div>
                      {{ course.title }}
                      <v-icon
                        v-if="course.active"
                        color="success"
                        class="active-icon"
                        small
                      >
                        check_circle_outline
                      </v-icon>
                    </div>
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </div>
          </v-list>
        </div>
      </template>
    </div>

    <div v-if="isPresident" class="lessons__actions">
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
import { LecturerShow, lecturersApi } from '~/api/lecturers.ts'
import { useConfirmDelete } from '~/compositions/useConfirmDelete.ts'

interface StateI {
  /** Флаг загрузки информации о преподавателе */
  loadInfo: Boolean
  /** Модель преподавателя на просмотр */
  showenModel: LecturerShow | null
}

interface PropsI {
  /** ID преподавателя */
  lecturerId: string
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
    }
  },
  setup(props: PropsI, context) {
    const vuexModules = context.root.$vuexModules

    const state = reactive<StateI>({
      loadInfo: true,
      showenModel: null
    })

    /** Флаг что пользователь является старостой */
    const isPresident = context.root.$vuexModules.User.isPresident

    /** Посмотреть предмет */
    const show = async () => {
      try {
        state.showenModel = null
        state.loadInfo = true
        state.showenModel = await lecturersApi.show(props.lecturerId)
      } catch (error) {
        vuexModules.Snackbars.ADD_SNACKBARS(error.snackbarErrors)
      } finally {
        state.loadInfo = false
      }
    }

    onMounted(() => {
      show()
    })

    const { confirmDelete } = useConfirmDelete(context, {
      text: context.root.$t('lecturers.confirm') as string,
      id: props.lecturerId
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
.active-icon {
  display: inline-block;
  width: 15px;
}

.lesson__content {
  display: flex;
  justify-content: space-between;
}

.lesson__content > div {
  flex-grow: 1;
}

.mobile .lesson__content {
  flex-direction: column;
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

.lessons__actions {
  display: flex;
}
</style>

<style>
.lecturer__skeletons .v-skeleton-loader__avatar.v-skeleton-loader__bone {
  height: 100px;
  width: 100px;
}
</style>
