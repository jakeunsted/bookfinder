<template>
  <div class="flex flex-col justify-items-center items-center mt-10">
    <!-- Row one -->
    <div class="mb-5">
      <v-avatar color="primary" size="80">
        <span class="text-white">JU</span>
      </v-avatar>
    </div>
    <!-- Row two -->
    <div class="flex flex-col items-center">
      <!-- users name -->
      <span>{{user.username}}</span>
      <span>Date Joined: {{user.signupDate}}</span>
    </div>
    <!-- Row three -->
    <v-sheet :height="2" class="my-10 w-10/12 bg-grey"></v-sheet>
  </div>
</template> 

<script setup>
definePageMeta({
  middleware: 'auth',
  layout: 'profile'
});

const loading = ref(true);

// Get user from API
// const userData = ref({
//   username: '',
//   email: '',
//   role: '',
//   signupDate: ''
// })
const user = ref({
  username: 'Jakeunsted',
  email: 'jake.unsted@gmail.com',
  role: 'Admin',
  signupDate: '2024-06-01'
})

onMounted(() => {
  try {
    console.log('loading home');
    // need to get user from store thats populated from JWT

    // const { user, error } = await useMyFetch(`/user/${route.params.id}`, {
    //   method: 'GET',
    //   headers: {
    //     'Content-Type': 'application/json'
    //   },
    // })
    //   .then(data => ({ user: data }))
    //   .catch(error => ({ error }))

    // if (error) {
    //   console.error('Failed to fetch user data:', error)
    // } else {
    //   userData.value.email = user.email
    //   userData.value.role = user.role
    //   userData.value.signupDate = user.createdAt
    //   userData.value.username = user.username
    // }
  } catch (error) {
    console.error('An error occurred while fetching user data:', error)
  } finally {
    loading.value = false
  }
})

</script>