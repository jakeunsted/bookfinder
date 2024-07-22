<template>
  <v-container>
    <UserCard :user="userData" />
  </v-container>
</template>

<script setup>
definePageMeta({
  middleware: 'auth'
})

import UserCard from '@/components/UserCard.vue'
import { ref } from 'vue'
import { onMounted } from 'vue'

const userData = ref({
  username: 'john_doe',
  email: 'john.doe@example.com',
  role: 'Admin',
  signupDate: '2023-07-01'
})

onMounted(async () => {
  const route = useRoute()
  console.log('route params:', route.params);
  /**
   * Get user data from the API
   * /user/:id
   */
  try {
    console.log('getting user data');
    const { user, error } = await fetch(`http://localhost:3001/user/${route.params.id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
    })
      .then(response => response.json())
      .then(data => ({ user: data }))
      .catch(error => ({ error }))

    console.log('user:', user);

    if (error.value) {
      console.error('Failed to fetch user data:', error.value)
    } else {
      console.log('User data:', data.value);
      // Update the userData ref with the fetched data
      userData.value.email = user.value.email
      userData.value.role = user.value.role
      userData.value.signupDate = user.value.createdAt
      userData.value.username = user.value.username
    }
  } catch (error) {
    console.error('An error occurred while fetching user data:', error)
  }
})
</script>
