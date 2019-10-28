<template>
  <Loader v-if="loading" :show-form="true" :form-inputs-count="2" />

  <v-card v-else>
    <v-card-title>{{
      $t(`group.${localGroup.id ? 'update' : 'create'}`)
    }}</v-card-title>

    <v-card-text>
      <v-form ref="form" :lazy-validation="true">
        <v-text-field
          v-model="localGroup.title"
          :label="$t('field.title')"
          type="text"
          :rules="[$rules.required]"
          outlined
        />

        <v-text-field
          v-model="localGroup.number"
          :label="$t('field.number')"
          type="text"
          :rules="[$rules.required]"
          outlined
        />
      </v-form>
    </v-card-text>

    <v-card-actions>
      <v-btn color="primary" :disabled="updating" @click="save">{{
        $t('actions.save')
      }}</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop, Ref } from 'vue-property-decorator'
import { GroupModule } from '~/store/group.ts'
import { GroupI } from '~/api/group.ts'

@Component({
  components: {
    Loader: () =>
      import(
        '~/components/UI-core/loader.vue' /* webpackChunkName: 'components/UI-core/loader' */
      )
  }
})
export default class EditGroup extends Vue {
  /**
   * Ссылка на компонент формы из vuetify
   */
  @Ref()
  readonly form: { validate: () => boolean }

  /**
   * Загружать ли данные при монтирование компонента
   */
  @Prop({ type: Boolean, required: true })
  readonly loadInMounted!: boolean

  /**
   * Группа
   */
  localGroup: GroupI = {
    id: '',
    title: '',
    number: ''
  }

  /**
   * Флаг загрузки
   */
  get loading(): boolean {
    return GroupModule.loading
  }

  /**
   * Флаг обновления
   */
  get updating(): boolean {
    return GroupModule.updating
  }

  /**
   * Группа
   */
  get group(): GroupI {
    return GroupModule.group
  }

  @Watch('group')
  onGroupChange() {
    this.localGroup = { ...this.group }
  }

  mounted() {
    if (this.loadInMounted) GroupModule.getGroup()
  }

  /**
   * Сохранить группу
   */
  save() {
    if (!this.form.validate()) return

    this.localGroup.id
      ? GroupModule.updateGroup(this.localGroup)
      : GroupModule.createGroup(this.localGroup)
  }
}
</script>
