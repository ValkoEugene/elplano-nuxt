<template>
  <Card small>
    <template v-slot:title>{{ event.title }}</template>

    <template v-slot:menu>
      <!-- <v-btn icon class="text-primary" :disabled="true">
        <v-icon>star_half</v-icon>
      </v-btn>

      <v-btn icon class="text-primary" :disabled="true">
        <v-icon>work</v-icon>
      </v-btn> -->

      <EditButton
        :president-access="false"
        :disabled="updating"
        @click="edit"
      />

      <DeleteButton
        :id="id"
        :disabled="updating"
        :president-access="false"
        :confirm-text="$t('events.confirm')"
        @delete="$emit('delete')"
      />
    </template>
  </Card>
</template>

<script>
export default {
  name: 'EventCard',
  components: {
    Card: () =>
      import(
        '../UI-core/card.vue' /* webpackChunkName: 'components/UI-core/card' */
      ),
    DeleteButton: () =>
      import(
        '../UI-core/delete-button.vue' /* webpackChunkName: 'components/UI-core/delete-button' */
      ),
    EditButton: () =>
      import(
        '../UI-core/edit-button.vue' /* webpackChunkName: 'components/UI-core/edit-button' */
      )
  },
  props: {
    /**
     * Id элемента расписания
     * @type {String}
     */
    id: {
      type: String,
      required: true
    },

    /**
     * Элмент расписания
     * @type {Object}
     */
    event: {
      type: Object,
      required: true
    },

    /**
     * Флаг обновления
     * @type {Boolean}
     */
    updating: {
      type: Boolean,
      required: true
    }
  },
  methods: {
    edit() {
      this.$emit('edit', this.event)
    }
  }
}
</script>
