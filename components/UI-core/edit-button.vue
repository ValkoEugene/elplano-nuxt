<template>
  <v-list-item
    v-show="!presidentAccess || isPresident"
    icon
    class="text-primary"
    :disabled="disabled"
    @click="$emit('click')"
  >
    <v-icon class="pr-2">edit</v-icon>
    {{ $t('ui.edit') }}
  </v-list-item>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component
export default class EditButton extends Vue {
  /**
   * Флаг отключения кнопки
   * @type {Boolean}
   */
  @Prop({ type: Boolean, default: false })
  readonly disabled!: boolean

  /**
   * Флаг доступа только старосте
   * @type {Boolean}
   */
  @Prop({ type: Boolean, default: true })
  readonly presidentAccess!: boolean

  /**
   * Флаг является ли пользователь старостой
   */
  get isPresident(): boolean {
    return this.$vuexModules.User.isPresident
  }
}
</script>
