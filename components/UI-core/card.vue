<template>
  <div class="card elevation-5">
    <div v-if="$scopedSlots.badges" class="card__badges">
      <slot name="badges" />
    </div>

    <div
      v-if="$scopedSlots.title || $scopedSlots.menu"
      class="card__title--wrapper"
    >
      <div v-if="$scopedSlots.title" class="card__title--text">
        <slot name="title" />
      </div>

      <v-menu v-if="$scopedSlots.menu" left bottom class="card__menu">
        <template v-slot:activator="{ on }">
          <v-btn icon class="card__actions" v-on="on">
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>

        <v-list :min-width="200">
          <slot name="menu" />
        </v-list>
      </v-menu>
    </div>

    <div v-if="$scopedSlots.content" class="card__content">
      <slot name="content" />
    </div>

    <div
      v-if="$scopedSlots.actions"
      class="card__actions"
      :style="actionsStyle"
    >
      <slot name="actions" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'Card',
  props: {
    /**
     * Направление кнопок
     * @type {('start' | 'end')}
     */
    actionsJustifyContent: {
      type: String,
      default: 'start'
    }
  },
  computed: {
    /**
     * Стили для кнопок
     * @type {Object}
     */
    actionsStyle() {
      return {
        'justify-content': `flex-${this.actionsJustifyContent}`
      }
    }
  }
}
</script>

<style scoped>
.card {
  position: relative;
  min-height: 100px;
  background-color: #ffffff;
  color: rgba(0, 0, 0, 0.87);
  border-radius: 4px;
  padding: 15px;
  word-break: break-word;
  word-wrap: break-word;
}

.card__badges {
  position: absolute;
  top: -10px;
  left: 15px;
}

.card__badges span {
  background: var(--primary-darken1);
  color: #fff;
  padding: 5px;
  border-radius: 4px;
  margin-right: 5px;
  box-shadow: 0px 3px 5px -1px rgba(0, 0, 0, 0.2),
    0px 5px 8px 0px rgba(0, 0, 0, 0.14), 0px 1px 14px 0px rgba(0, 0, 0, 0.12) !important;
}

.card__title--wrapper {
  display: flex;
  justify-content: space-between;
  font-size: 1.25rem;
  font-family: 'Roboto', sans-serif;
  margin-bottom: 10px;
}

.card__title--text {
  align-self: center;
}

.card__content--wrapper {
  display: block;
}

.card__content {
  display: block;
  color: rgba(0, 0, 0, 0.54);
}

.card__menu {
  display: block;
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
