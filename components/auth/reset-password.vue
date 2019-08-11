<template>
  <v-card>
    <v-card-text>
      <v-form>
        <!-- eslint-disable -->
        <v-text-field v-model="email" label="Email" placeholder="Email" type="text" outlined />
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <!-- eslint-disable -->
      <v-btn color="primary">Сбросить</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: 'ResetPassword',
  data: () => ({
    email: ''
  })
}
</script>
