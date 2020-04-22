<template>
  <div class="card elevation-2" :style="cardStyle">
    <div
      v-if="$scopedSlots.title || $scopedSlots.menu"
      class="card__title--wrapper"
      :style="titleStyle"
    >
      <img v-if="avatarUrl" :src="avatarUrl" class="card__content--avatar" />
      <div v-if="$scopedSlots.title" class="card__title--text">
        <slot name="title" />
      </div>

      <v-menu v-if="$scopedSlots.menu" left bottom attach>
        <template v-slot:activator="{ on }">
          <v-btn icon class="card__menu" v-on="on">
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>

        <v-list :min-width="240">
          <slot name="menu" />
        </v-list>
      </v-menu>
    </div>

    <div
      v-if="$scopedSlots.content"
      class="card__content"
      :class="[avatarUrl ? 'd-flex' : '']"
    >
      <slot name="content" />
    </div>

    <div
      v-if="$scopedSlots.badges"
      class="card__badges"
      :class="[$scopedSlots.actions ? 'mb-4' : '']"
    >
      <slot name="badges" />
    </div>

    <div
      v-if="$scopedSlots.actions"
      class="card__actions"
      :style="actionsStyle"
    >
      <slot name="actions" />
    </div>

    <div v-if="$scopedSlots.footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

export enum CardActionsJustifyContent {
  start = 'start',
  end = 'end'
}

/**
 * Компонент карточки
 */
@Component
export default class Card extends Vue {
  /**
   * Направление кнопок
   * @type {CardActionsJustifyContent}
   */
  @Prop({
    type: String as () => CardActionsJustifyContent,
    default: CardActionsJustifyContent.start
  })
  private readonly actionsJustifyContent!: CardActionsJustifyContent

  /**
   * Флаг уменшенного отображения карточки
   * @type {boolean}
   */
  @Prop({ type: Boolean, default: false })
  private readonly small!: boolean

  /**
   * Высота карточки
   */
  @Prop({ type: String, default: '100%' })
  private readonly cardHeight!: string

  /**
   * SRC для аватара
   * @type {String}
   */
  @Prop({ type: String, default: '' })
  private readonly avatarUrl!: string

  /**
   * Стили для карточки
   */
  get cardStyle() {
    return {
      height: this.cardHeight,
      'min-height': this.small ? '50px' : '100px',
      padding: this.small ? '15px 10px' : '15px'
    }
  }

  /**
   * Стили для заголовка
   */
  get titleStyle() {
    return {
      'margin-bottom': this.small ? '' : '10px'
    }
  }

  /**
   * Стили для кнопок
   * @type {Object}
   */
  get actionsStyle() {
    return {
      'justify-content': `flex-${this.actionsJustifyContent}`
    }
  }
}
</script>

<style scoped>
.card {
  position: relative;
  background-color: #ffffff;
  color: rgba(0, 0, 0, 0.87);
  border-radius: 4px;
  word-break: break-word;
  word-wrap: break-word;
  height: 100%;
}

.theme--dark .card {
  background-color: #2c2b4a;
  color: #aeaeae;
}

.card__badges {
  margin-top: 5px;
}

.card__badges span {
  background: var(--primary-darken1);
  max-height: 30px;
  overflow: hidden;
  display: inline-block;
  color: #fff;
  padding: 5px;
  border-radius: 4px;
  margin-right: 5px;
}
.theme--dark .card__badges span {
  color: #aeaeae;
  background: #5e5c9c;
}
.mobile .card__badges span {
  font-size: 0.675rem;
}

.card__title--wrapper {
  display: flex;
  justify-content: space-between;
  font-size: 1.25rem;
  font-family: 'Roboto', sans-serif;
}
.mobile .card__title--wrapper {
  font-size: 1rem;
}

.card__title--text {
  align-self: center;
  width: 100%;
}

.card__content--wrapper {
  display: block;
}

.card__content {
  display: block;
  color: rgba(0, 0, 0, 0.54);
}
.theme--dark .card__content {
  color: #aeaeae;
}
.mobile .card__content {
  font-size: 0.875rem;
}

.card__content--avatar {
  max-width: 100%;
  width: 100px;
  height: 100px;
  margin-right: 10px;
  border-radius: 50%;
}

.mobile .card__content--avatar {
  width: 50px;
  height: 50px;
}

.card__menu {
  display: block;
  margin-top: -15px;
  margin-right: -15px;
}

.card__actions {
  display: flex;
}

.card__actions--start {
  justify-content: flex-start;
}

.card__actions--end {
  justify-content: flex-end;
}
</style>
