<template>
  <div class="readonly-text-field__wrapper">
    <div
      class="v-input v-input--is-label-active v-input--is-dirty v-input--is-readonly theme--light v-text-field v-text-field--is-booted"
    >
      <div class="v-input__control">
        <div class="v-input__slot">
          <div class="v-text-field__slot">
            <label
              for="input-5350"
              class="v-label v-label--active theme--light"
              style="left: 0px; right: auto; position: absolute;"
              >{{ label }}</label
            >

            <div class="readonly-text-field__value">{{ value }}</div>
          </div>
        </div>
        <div class="v-text-field__details">
          <div class="v-messages theme--light">
            <div class="v-messages__wrapper"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class ReadonlyTextField extends Vue {
  /**
   * Описание к полю
   */
  @Prop({ type: String, required: true })
  private readonly label!: string

  /**
   * Значения поля
   */
  @Prop({ type: String, required: true })
  private readonly value!: string
}
</script>

<style scoped>
.readonly-text-field__wrapper {
}

.readonly-text-field__value {
  margin-top: 10px;
}

.readonly-text-field__wrapper
  .v-text-field
  > .v-input__control
  > .v-input__slot:before,
.readonly-text-field__wrapper
  .v-text-field
  > .v-input__control
  > .v-input__slot:after {
  display: none;
}
</style>
