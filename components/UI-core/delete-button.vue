<template>
  <!-- eslint-disable -->
  <v-btn
    icon
    color="error"
    :disabled="disabled"
    @click="initDeleting({ id, namespace, action, text: confirmText })"
  >
    <v-icon>delete</v-icon>
  </v-btn>
</template>

<script>
import { mapActions } from 'vuex'
import { namespace, Types } from '../../store/modal/delet'

export default {
  name: 'DeleteButton',
  props: {
    /**
     * Id id of deleted item
     * @type {String}
     */
    id: {
      type: String,
      required: true
    },
    /**
     * Flag that the button is disabled
     * @type {Boolean}
     */
    disabled: {
      type: Boolean,
      default: false
    },
    /**
     * Vuex module namespace deleted item
     * @type {String}
     */
    namespace: {
      type: String,
      required: true
    },
    /**
     * Action in vuex that delet item
     * @type {String}
     */
    action: {
      type: String,
      required: true
    },
    /**
     * Text for deleting confirmation
     * @type {String}
     */
    confirmText: {
      type: String,
      required: true
    }
  },
  methods: {
    ...mapActions(namespace, {
      /**
       * Init data for vuex modal/delete module
       */
      initDeleting: Types.actions.INIT_DELETING
    })
  }
}
</script>