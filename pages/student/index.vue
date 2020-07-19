<template>
  <profile-edit />
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'

const components = {
  ProfileEdit: () => import('~/components/student/profile-edit.vue')
}

export default defineComponent({
  name: 'StudentPage',
  components
})
</script>
