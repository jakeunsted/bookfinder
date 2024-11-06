<template>
  <ion-page class="overflow-auto pb-64"> 
    <div>
      <v-snackbar
        v-model="snackbar"
        :timeout="snackbarTimeout"
        :color="snackbarColor"
        rounded="pill"
        location="top"
      >
        {{ snackbarMessage }}
        <template v-slot:actions>
          <v-btn
            color="white"
            variant="text"
            @click="snackbar = false"
          >
            Close
          </v-btn>
        </template>
      </v-snackbar>
  
      <div v-if="!userLoading">
        <div class="flex flex-col justify-items-center items-center mt-10">
          <div class="mb-5">
            <v-avatar color="primary" size="80">
              <span class="text-white">JU</span>
            </v-avatar>
          </div>
          <div class="flex flex-col items-center">
            <!-- users name -->
            <span>{{ user.username }}</span>
            <span>
              Date Joined: 
              {{ new Date(user.createdAt).toLocaleDateString('en-GB') }}
            </span>
          </div>
          <v-sheet :height="2" class="my-10 w-10/12 bg-grey"></v-sheet>
        </div>

        <!-- Show books otherwise show blank message about 
          adding your first book -->
        <div v-if="!booksLoading">
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
                    <v-img 
                      :src="book.book.bookDetails?.
                        volumeInfo?.imageLinks?.thumbnail || 
                        book.image" 
                      class="pb-2 max-h-50"
                    ></v-img>
                    <p>{{ book.book.title }}</p>
                    <p class="text-grey">
                      {{ 
                        new Date(book.dateFinished ||
                          book.dateStarted ||
                          book.createdAt).toLocaleDateString()
                      }}
                    </p>
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
          <v-progress-circular
            indeterminate color="primary"
          />
        </div>
      </div>
    </div>
  </ion-page>
</template>

<script setup>
import { useBookStore } from '@/stores/useBookStore';
import { useAuthStore } from '@/stores/useAuthStore';

definePageMeta({
  middleware: 'auth',
  layout: 'profile',
});

const route = useRoute();

const booksLoading = ref(true);
const userLoading = ref(true);
const readBooks = ref([]);

const user = ref({});

const goToBookDetails = (bookId) => {
  navigateTo(`/books/${user.value.id}/${bookId}`);
};

/**
 * watch for user.id to be set
 */
watch(user, async () => {
  userLoading.value = false;
});

const snackbar = ref(false);
const snackbarMessage = ref('');
const snackbarColor = ref('success');
const snackbarTimeout = ref(3000);

const showToast = (message, color = 'success') => {
  snackbarMessage.value = message;
  snackbarColor.value = color;
  snackbar.value = true;
};
  
// Fetch user books on component mount
onMounted(async () => {
  let toastMsg = route?.query?.toast;
  if (toastMsg) {
    if (toastMsg === 'book-started') {
      showToast('Book has been started!');
    }
    if (toastMsg === 'book-read') {
      showToast('Book has been marked as read!');
    }
  }
      
  try {
    const bookStore = await useBookStore();
    const authStore = await useAuthStore();
    user.value = authStore.getUser();
    readBooks.value = await bookStore.getAllBooks;
    if (!readBooks.value.length) {
      readBooks.value = await bookStore.fetchBooks(user.value.id);
    }
  } catch (error) {
    console.error('An error occurred while fetching user books:', error);
  } finally {
    booksLoading.value = false;
  }
});
</script>
