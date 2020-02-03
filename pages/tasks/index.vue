<template>
  <div>
    <v-alert type="info" prominent>
      <span>{{ $t('ui.notready') }}</span>
    </v-alert>

    <labels-field v-model="labels" />
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import CheckGroup from '~/mixins/CheckGroup.ts'

@Component({
  components: {
    LabelsField: () => import('~/components/UI-core/labels-field.vue')
  }
})
export default class TasksPage extends Mixins(CheckGroup) {
  labels: string[] = []
}
</script>
