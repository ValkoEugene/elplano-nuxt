<template>
  <div>
    <v-alert type="info" prominent>
      <span>{{ $t('ui.notready') }}</span>
    </v-alert>
  </div>
</template>

<script>
import checkGroup from '~/mixins/checkgroup'

export default {
  name: 'MeasuresPage',
  mixins: [checkGroup]
}
</script>
