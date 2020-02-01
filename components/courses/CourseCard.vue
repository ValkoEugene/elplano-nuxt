<!-- Карточка с предметом -->

<template>
  <Card>
    <template v-slot:badges>
      <span v-if="course.active">
        {{ $t('ui.card.badges.active') }}
      </span>
    </template>

    <template v-slot:title>
      {{ course.title }}
    </template>

    <template v-slot:content>
      <div>
        <span class="font-weight-bold">{{ $t('lecturers.lecturers') }}:</span>
        <span v-if="!course.lecturer_ids.length">-</span>

        <template v-else>
          <div v-for="id in course.lecturer_ids" :key="id" class="ma-1">
            <v-avatar size="32">
              <img src="/images/professor.png" />
            </v-avatar>
            {{ getLecturerView(id) }}
          </div>
        </template>
      </div>
    </template>

    <template v-slot:menu>
      <v-list-item :disabled="true">
        <v-icon class="pr-2">star_half</v-icon>
        {{ $t('ratings.add') }}
      </v-list-item>
      <v-list-item :disabled="true">
        <v-icon class="pr-2">work</v-icon>
        {{ $t('tasks.add') }}
      </v-list-item>
      <EditButton :disabled="updating" @click="edit(course)" />
      <DeleteButton
        :id="course.id"
        :disabled="updating"
        :confirm-text="$t('lesson.confirm')"
        @delete="deleteCourse(course.id)"
      />
    </template>
  </Card>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { Course } from '~/api/courses.ts'

@Component({
  components: {
    DeleteButton: () =>
      import(
        '~/components/UI-core/delete-button.vue' /* webpackChunkName: 'components/UI-core/delete-button' */
      ),
    EditButton: () =>
      import(
        '~/components/UI-core/edit-button.vue' /* webpackChunkName: 'components/UI-core/edit-button' */
      ),
    Card: () =>
      import(
        '~/components/UI-core/card.vue' /* webpackChunkName: 'components/UI-core/card' */
      )
  }
})
export default class CourseCard extends Vue {
  /**
   * Предмет
   */
  @Prop({ type: Object as () => Course, required: true })
  readonly course!: Course

  /**
   * Флаг процесса обновления
   * (При обновление какого либа предмета блокируем кнопки)
   */
  @Prop({ type: Boolean, required: true })
  readonly updating!: boolean

  /**
   * Функиция для получения отображения преподователя по Id
   * @type {Function}
   */
  @Prop({ type: Function, required: true })
  readonly getLecturerView!: (id: string) => string

  /**
   * Удалить Предмет
   */
  deleteCourse(id: string) {
    this.$emit('deleteCourse', id)
  }

  /**
   * Редактировать предметт
   */
  edit(course: Course) {
    this.$emit('editCourse', course)
  }
}
</script>
