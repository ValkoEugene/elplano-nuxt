<template>
  <div>
    <v-alert type="info" prominent>
      <span>{{ $t('ui.notready') }}</span>
    </v-alert>
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import CheckGroup from '~/mixins/CheckGroup.ts'

@Component({})
export default class AttachmentsPage extends Mixins(CheckGroup) {}
</script>
