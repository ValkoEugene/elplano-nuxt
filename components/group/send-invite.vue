<template>
  <Card>
    <template v-slot:title>{{ $t('invites.send') }}</template>

    <template v-slot:content>
      <v-form ref="form" :lazy-validation="true">
        <v-text-field
          v-model="invite.email"
          label="Email"
          type="text"
          :rules="[$rules.email]"
          outlined
        />
      </v-form>
    </template>

    <template v-slot:actions>
      <v-btn
        color="primary"
        :disabled="!invite.email.length || updating"
        @click="send"
        >{{ $t('actions.send') }}</v-btn
      >
    </template>
  </Card>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { namespace, Types } from '~/store/invites/group-invites'

export default {
  name: 'SendInvite',
  components: {
    Card: () =>
      import(
        '~/components/UI-core/card.vue' /* webpackChunkName: 'components/UI-core/card' */
      )
  },
  data: () => ({
    /**
     * Группа
     * @type {Object}
     */
    invite: {
      email: ''
    }
  }),
  computed: {
    ...mapState(namespace, [
      /**
       * Флаг обновления
       * @type {Boolean}
       */
      'updating'
    ])
  },
  watch: {
    /**
     * Обновляем список приглашений
     */
    updating() {
      if (!this.updating) {
        this.invite = { email: '' }
        this.$emit('sendInvite')
      }
    }
  },
  methods: {
    ...mapActions(namespace, {
      /**
       * Отправить приглашение
       */
      sendInvite: Types.actions.SEND_INVITE
    }),

    /**
     * Отправить
     */
    send() {
      if (!this.$refs.form.validate()) return

      this.sendInvite(this.invite)
    }
  }
}
</script>
