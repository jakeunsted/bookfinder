<template>
  <div class="flex flex-col justify-items-center items-center mt-10">
    <div class="mb-5">
      <v-avatar color="primary" size="80">
        <span class="text-white">JU</span>
      </v-avatar>
    </div>
    <div class="flex flex-col items-center">
      <!-- users name -->
      <span>{{ user.username }}</span>
      <span>Date Joined: {{ user.signupDate }}</span>
    </div>
    <v-sheet :height="2" class="my-10 w-10/12 bg-grey"></v-sheet>

    <!-- Show books otherwise show blank message about adding your first book-->
    <div v-if="!loading">
      <div v-if="readBooks.length">
        <div class="flex flex-row flex-wrap justify-center">
          <div v-for="book in readBooks" :key="book.book.id" class="p-2">
            <v-card
              class="max-w-44 min-w-44 p-2"
              rounded="xl"
              elevation="10"
              @click="goToBookDetails(book.id)"
            >
              <v-card-text class="text-wrap text-center">
                <v-img :src="book.book.bookDetails?.volumeInfo?.imageLinks?.thumbnail || book.image" class="pb-2 max-h-50"></v-img>
                <p>{{ book.book.title }}</p>
                <p class="text-grey">{{ new Date(book.dateFinished).toLocaleDateString() }}</p>
              </v-card-text>
            </v-card>
          </div>
        </div>
      </div>
      <div v-else>
        <span>You haven't read any books yet. Add your first book!</span>
      </div>
    </div>
    <div v-else>
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useMyFetch } from '@/composables/useMyFetch';

definePageMeta({
  middleware: 'auth',
  layout: 'profile',
});

const loading = ref(true);
const readBooks = ref([]); // Initialize readBooks as an empty array

// Placeholder user data (replace with store or API)
const user = ref({
  id: 1,
  username: 'Jakeunsted',
  email: 'jake.unsted@gmail.com',
  role: 'Admin',
  signupDate: '2024-06-01'
});

const goToBookDetails = (bookId) => {
  console.log('show the book details:', bookId);
  navigateTo(`/books/${user.value.id}/${bookId}`);
};

// Fetch user books on component mount
onMounted(async () => {
  try {
    const response = await useMyFetch(`/users-books/${1}`);

    if (response.error) {
      console.error('Failed to fetch user books:', response.error);
    } else {
      readBooks.value = response;
      console.log('readBooks:', readBooks.value);
    }
  } catch (error) {
    console.error('An error occurred while fetching user books:', error);
  } finally {
    loading.value = false;
  }
});
</script>
