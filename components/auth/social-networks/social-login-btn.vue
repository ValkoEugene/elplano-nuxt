<template>
  <v-btn
    outlined
    color="primary"
    class="social-networks__btn"
    @click="$emit('click')"
  >
    <img
      class="social-networks__logo"
      :src="iconSrc"
      :style="{ height: `${iconHeight}px` }"
    />
    {{ provider }}
  </v-btn>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component({})
export default class SocialLoginBtn extends Vue {
  /**
   * Ссылка на иконку
   */
  @Prop({ type: String, required: true })
  readonly iconSrc!: string

  /**
   * Название сервиса
   */
  @Prop({ type: String, required: true })
  readonly provider!: string

  /**
   * Высота иконок
   */
  @Prop({ type: Number, default: 25 })
  readonly iconHeight!: number
}
</script>

<style scoped>
.v-btn.social-networks__btn {
  padding: 0 5px;
  width: 45%;
  margin: 5px 0;
  padding-left: 15px;
  display: flex;
  justify-content: flex-start;
}

.social-networks__logo {
  cursor: pointer;
  margin-right: 10px;
}

@media (max-width: 900px) {
  .v-btn.social-networks__btn {
    width: 65%;
  }
}
</style>
