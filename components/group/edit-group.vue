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
import { GroupState } from '~/store/group.ts'
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
   * Модуль vuex с группами
   */
  groupState = new GroupState(this.$store)

  /**
   * Флаг загрузки
   */
  get loading(): boolean {
    return this.groupState.state.loading
  }

  /**
   * Флаг обновления
   */
  get updating(): boolean {
    return this.groupState.state.updating
  }

  /**
   * Группа
   */
  get group(): GroupI {
    return this.groupState.state.group
  }

  @Watch('group')
  onGroupChange() {
    this.localGroup = { ...this.group }
  }

  mounted() {
    if (this.loadInMounted) this.loadGroup()
  }

  /**
   * Загрузить группу
   */
  loadGroup() {
    this.groupState.getGroupAction()
  }

  /**
   * Сохранить группу
   */
  save() {
    if (!this.form.validate()) return

    this.localGroup.id
      ? this.groupState.updateGroupAction(this.localGroup)
      : this.groupState.createGroupAction(this.localGroup)
  }
}
</script>
