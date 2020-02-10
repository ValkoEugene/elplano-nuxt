<template>
  <Loader
    v-if="loadInMounted && loading"
    :show-form="true"
    :form-inputs-count="2"
  />

  <card v-else>
    <template #title>{{
      $t(`group.${localGroup.id ? 'update' : 'create'}`)
    }}</template>

    <template #content>
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
    </template>

    <template #actions>
      <v-btn color="primary" :disabled="updating" @click="save">{{
        $t('actions.save')
      }}</v-btn>
    </template>
  </card>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop, Ref } from 'vue-property-decorator'
import { GroupI } from '~/api/group.ts'

@Component({
  components: {
    Card: () =>
      import(
        '~/components/UI-core/card.vue' /* webpackChunkName: 'components/UI-core/card' */
      ),
    Loader: () =>
      import(
        '~/components/UI-core/loaders/loader.vue' /* webpackChunkName: 'components/UI-core/loaders/loader' */
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
    return this.$vuexModules.Group.loading
  }

  /**
   * Флаг обновления
   */
  get updating(): boolean {
    return this.$vuexModules.Group.updating
  }

  /**
   * Группа
   */
  get group(): GroupI {
    return this.$vuexModules.Group.group
  }

  @Watch('group')
  onGroupChange() {
    this.localGroup = { ...this.group }
  }

  mounted() {
    if (this.loadInMounted) this.$vuexModules.Group.getGroup()
  }

  /**
   * Сохранить группу
   */
  save() {
    if (!this.form.validate()) return

    this.localGroup.id
      ? this.$vuexModules.Group.updateGroup(this.localGroup)
      : this.$vuexModules.Group.createGroup(this.localGroup)
  }
}
</script>
