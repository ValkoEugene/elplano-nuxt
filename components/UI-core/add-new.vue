<template>
  <v-btn
    v-show="!presidentAccess || $store.getters['user/IS_PRESIDENT']"
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
}
</script>
