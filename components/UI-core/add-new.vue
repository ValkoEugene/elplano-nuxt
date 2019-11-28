<template>
  <v-btn
    v-show="!presidentAccess || isPresident"
    fixed
    dark
    fab
    bottom
    right
    class="bg-primary-darken4"
    :disabled="disabled"
    @click="$emit('click')"
  >
    <v-icon>add</v-icon>
  </v-btn>
</template>

<script lang="ts">
import { Vue, Prop, Component } from 'vue-property-decorator'

/**
 * Компонент кнопки добавления новой сущности
 */
@Component
export default class AddNew extends Vue {
  /**
   * Флаг отключения кнопки
   * @type {Boolean}
   */
  @Prop({ type: Boolean, default: false }) readonly disabled!: boolean

  /**
   * Флаг доступа только старосте
   * @type {Boolean}
   */
  @Prop({ type: Boolean, default: true }) readonly presidentAccess!: boolean

  /**
   * Флаг является ли пользователь старостой
   */
  get isPresident(): boolean {
    return this.$vuexModules.User.isPresident
  }
}
</script>
