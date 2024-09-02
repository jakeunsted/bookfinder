<template>
  <div class="flex flex-col justify-items-center items-center mt-10">
    <div class="mb-5">
      <v-avatar color="primary" size="80">
        <span class="text-white">JU</span>
      </v-avatar>
    </div>
    <div class="flex flex-col items-center">
      <!-- users name -->
      <span>{{user.username}}</span>
      <span>Date Joined: {{user.signupDate}}</span>
    </div>
    <v-sheet :height="2" class="my-10 w-10/12 bg-grey"></v-sheet>

    <!-- Show books otherwise show blank message about adding your first book-->
    <div v-if="readBooks.length">
      <div class="flex flex-row flex-wrap justify-center">
        <div v-for="book in readBooks" :key="book.title" class="p-2">
          <v-card 
            class="max-w-44 min-w-44 p-2"
            rounded="xl"
            elevation="10"
          >
            <v-card-text class="text-wrap text-center">
              <v-img :src="book.image" class="pb-2 max-h-50"></v-img>
              <p>{{book.title}}</p>
              <p class="text-grey">{{book.dateRead}}</p>
            </v-card-text>
          </v-card>
        </div>
      </div>
    </div>
    <div v-else>
      <span>You haven't read any books yet. Add your first book!</span>
    </div>
    
  </div>
</template> 

<script setup>
definePageMeta({
  middleware: 'auth',
  layout: 'profile',
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

const readBooks = ref([
  {
    title: 'The Housemaid',
    author: 'Freida McFadden',
    description: `Every day I clean the Winchesters' beautiful house top to bottom. I collect their daughter from school...`,
    pageCount: '336',
    categories: ['Fiction', 'Thriller'],
    image: 'http://books.google.com/books/content?id=dx5VzwEACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api',
    dateRead: '2024-06-01'
  },
  {
    title: `The Housemaid's Secret`,
    author: 'Freida McFadden',
    description: `As he continues showing me their incredible penthouse apartment, I have a terrible feeling about the woman behind closed doors...`,
    pageCount: '352',
    categories: ['Fiction', 'Thriller'],
    image: 'http://books.google.com/books/content?id=9WylzwEACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api',
    dateRead: '2024-06-01'
  },
  {
    title: `The Housemaid's Secret`,
    author: 'Freida McFadden',
    description: `As he continues showing me their incredible penthouse apartment, I have a terrible feeling about the woman behind closed doors...`,
    pageCount: '352',
    categories: ['Fiction', 'Thriller'],
    image: 'http://books.google.com/books/content?id=9WylzwEACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api',
    dateRead: '2024-06-01'
  },
  {
    title: 'The Housemaid Is Watching',
    author: 'Freida McFadden',
    description: `"You must be our new neighbors!" Mrs. Lowell gushes and waves across the picket fence. I clutch my daughter's hand and smile back`,
    pageCount: '400',
    categories: ['Fiction', 'Thriller'],
    image: 'http://books.google.com/books/content?id=gmR-0AEACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api',
    dateRead: '2024-06-01'
  }
])

onMounted(() => {
  try {
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