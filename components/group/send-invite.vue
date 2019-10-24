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

<script lang="ts">
import { Component, Vue, Ref } from 'vue-property-decorator'
import { sendInvite, inviteI } from '~/api/admin-invites.ts'
import { addSnackbarsByStore } from '~/store/snackbars'

@Component({
  components: {
    Card: () =>
      import(
        '~/components/UI-core/card.vue' /* webpackChunkName: 'components/UI-core/card' */
      )
  }
})
export default class SendInvite extends Vue {
  /**
   * Ссылка на компонент формы из vuetify
   */
  @Ref()
  readonly form!: { validate: () => boolean }

  /**
   * Группа
   */
  invite: inviteI = {
    email: ''
  }

  /**
   * Флаг обновления
   */
  updating: boolean = false

  /**
   * Отправить приглашение
   */
  async send() {
    if (!this.form.validate()) return

    try {
      this.updating = true
      await sendInvite(this.invite)

      this.invite = { email: '' }
      this.$emit('sendInvite')
    } catch (error) {
      addSnackbarsByStore(this.$store, error.snackbarErrors)
    } finally {
      this.updating = false
    }
  }
}
</script>
