<template>
  <Confirm
    :active="showingConfirmation"
    @cancel="showConfirmation(false)"
    @confirm="onConfirm"
  >
    <template v-slot:title>{{ text }}</template>
  </Confirm>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import { namespace, Types } from '../../store/modal/delet'

export default {
  name: 'ModalDelete',
  components: {
    Confirm: () =>
      import(
        '../UI-core/confirm.vue' /* webpackChunkName: 'components/UI-core/confirm' */
      )
  },
  computed: {
    ...mapState(namespace, ['showingConfirmation', 'text'])
  },
  methods: {
    ...mapMutations(namespace, {
      showConfirmation: Types.mutations.SET_SHOW_CONFIRMATION
    }),
    ...mapActions(namespace, {
      deletConfirmed: Types.actions.DELET_CONFIRMED
    }),
    /**
     * Confirm deleting and close modal
     */
    onConfirm() {
      this.deletConfirmed()
      this.showConfirmation(false)
    }
  }
}
</script>
