<template>
  <v-container>
    <div v-if="loadingUser">
      <v-progress-linear
      v-if="loadingUser"
      indeterminate
      color="primary"
      />
    </div>
    <div v-else>
      <UserBlock :user="userData" class="d-flex justify-center" />
      <v-divider></v-divider>
    </div>
  </v-container>
</template>

<script setup>
definePageMeta({
  middleware: 'auth'
})

import UserBlock from '~/components/user/UserBlock.vue'
import { ref } from 'vue'
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'

const userData = ref({
  username: '',
  email: '',
  role: '',
  signupDate: ''
})

const loadingUser = ref(true)

onMounted(async () => {
  const route = useRoute()
  
  try {
    const { user, error } = await useMyFetch(`/user/${route.params.id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
    })
      .then(data => ({ user: data }))
      .catch(error => ({ error }))

    if (error) {
      console.error('Failed to fetch user data:', error)
    } else {
      userData.value.email = user.email
      userData.value.role = user.role
      userData.value.signupDate = user.createdAt
      userData.value.username = user.username
    }
  } catch (error) {
    console.error('An error occurred while fetching user data:', error)
  } finally {
    loadingUser.value = false
  }
})
</script>
