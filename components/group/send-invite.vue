<template>
  <v-card>
    <v-card-title>{{ $t('invites.send') }}</v-card-title>

    <v-card-text>
      <v-form ref="form" :lazy-validation="true">
        <v-text-field
          v-model="invite.email"
          label="Email"
          placeholder="Email"
          type="text"
          :rules="[$rules.email]"
          outlined
        />
      </v-form>
    </v-card-text>

    <v-card-actions>
      <v-btn
        color="primary"
        :disabled="!invite.email.length || updating"
        @click="send"
        >{{ $t('actions.send') }}</v-btn
      >
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { namespace, Types } from '../../store/invites/group-invites'

export default {
  name: 'SendInvite',
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
