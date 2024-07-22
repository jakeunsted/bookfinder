<template>
  <v-card class="mx-auto" max-width="400">
    <v-card-title>User Profile</v-card-title>
    <v-card-subtitle>{{ user.username }}</v-card-subtitle>

    <v-card-text>
      <div>Email: {{ user.email }}</div>
      <div>Role: {{ user.role }}</div>
      <div>Date of Signup: {{ formatDate(user.signupDate) }}</div>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  user: {
    type: Object,
    required: true,
    default: () => ({
      username: '',
      email: '',
      role: '',
      signupDate: ''
    })
  }
})

function formatDate(date) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' }
  return new Date(date).toLocaleDateString(undefined, options)
}
</script>

<style scoped>
.v-card {
  padding: 20px;
}
</style>
