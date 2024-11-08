<template>
  <ion-page class="overflow-auto pb-64">
    <div class="z-[40]">
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
            <span>{{ user.username }}</span>
            <span>
              Date Joined: 
              {{ new Date(user.createdAt).toLocaleDateString('en-GB') }}
            </span>
          </div>
          <v-sheet :height="2" class="my-5 w-10/12 bg-grey"></v-sheet>
        </div>

        <v-tabs
          v-model="tab"
          align-tabs="center"
          slider-color="primary"
          class="mb-5"
        >
          <v-tab value="to-read">To Read</v-tab>
          <v-tab value="currently-reading">Currently Reading</v-tab>
          <v-tab value="read">Read</v-tab>
        </v-tabs>

        <div v-if="!booksLoading">
          <div v-if="filteredBooks.length">
            <masonry-wall
              :items="filteredBooks"
              :ssr-columns="1"
              :column-width="160"
              :gap="16"
              class="px-8"
            >
              <template #default="{ item }">
                <v-card
                  class="p-2 hover:cursor-pointer hover:bg-gray-100"
                  rounded="xl"
                  elevation="10"
                  @mousedown="startHold(item.id, $event)" 
                  @mouseup="endHold(item.id)"
                  @touchstart="startHold(item.id, $event)" 
                  @touchend="endHold(item.id)"
                >
                  <v-card-text class="text-wrap text-center">
                    <v-img 
                      :src="
                        item.book.bookDetails?.
                          volumeInfo?.imageLinks?.thumbnail || 
                          item.image
                      " 
                      class="pb-2 max-h-50"
                    ></v-img>
                    <p>{{ item.book.title }}</p>
                    <p class="text-grey" v-if="item.dateFinished">
                      Finished -  
                      {{ new Date(item.dateFinished).toLocaleDateString() }}
                    </p>
                    <p class="text-grey" v-else-if="item.dateStarted">
                      Started -  
                      {{ new Date(item.dateStarted).toLocaleDateString() }}
                    </p>
                    <p class="text-grey" v-else>
                      Added - 
                      {{ new Date(item.createdAt).toLocaleDateString() }}
                    </p>
                  </v-card-text>
                </v-card>
              </template>
            </masonry-wall>
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

        <v-dialog
          v-model="showQuickActions"
          class="backdrop-blur"
        >
          <v-card rounded="xl">
            <v-card-text class="text-wrap text-center">
              <v-img
                :src="selectedBook.book.bookDetails?.
                  volumeInfo?.imageLinks?.thumbnail || 
                  selectedBook.image
                "
                class="pb-2 max-h-36"
              />
              <p>{{ selectedBook.book.title }}</p>
            </v-card-text>
            <v-list>
              <v-list-item
                v-for="item in quickItems"
                :key="item.value"
                @click="handleItemClick(item)"
              >
                <v-list-item-title>
                  <v-icon>{{ item.icon }}</v-icon>
                  {{ item.title }}
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-card>
        </v-dialog>
      </div>
    </div>
  </ion-page>
</template>

<script setup>
import { useBookStore } from '@/stores/useBookStore';
import { useAuthStore } from '@/stores/useAuthStore';
import MasonryWall from '@yeger/vue-masonry-wall';

definePageMeta({
  middleware: 'auth',
  layout: 'profile',
});

const route = useRoute();

const { deleteBook } = useBookFunctions();

const tab = ref('currently-reading');
const booksLoading = ref(true);
const userLoading = ref(true);
const allBooks = ref([]);
const readBooks = ref([]);
const currentlyReadingBooks = ref([]);
const toReadBooks = ref([]);
const user = ref({});
const selectedBook = ref({});
const showQuickActions = ref(false);
let holdTimeout = null;
let holdLength = 0;

const quickItems = computed(() => {
  switch (tab.value) {
    case 'currently-reading':
      return [
        {
          title: 'Delete book from library',
          value: 'delete',
          icon: 'mdi-trash-can-outline',
        },
        {
          title: 'Find similar books',
          value: 'similar',
          icon: 'mdi-creation',
        },
        {
          title: 'Mark as read',
          value: 'read',
          icon: 'mdi-check',
        },
      ];
    case 'to-read':
      return [
        {
          title: 'Delete book from library',
          value: 'delete',
          icon: 'mdi-trash-can-outline',
        },
        {
          title: 'Find similar books',
          value: 'similar',
          icon: 'mdi-creation',
        },
        {
          title: 'Start reading',
          value: 'start',
          icon: 'mdi-book-open-page-variant',
        },
      ];
    case 'read':
      return [
        {
          title: 'Delete book from library',
          value: 'delete',
          icon: 'mdi-trash-can-outline',
        },
        {
          title: 'Find similar books',
          value: 'similar',
          icon: 'mdi-creation',
        },
      ];
    default:
      return [];
  }
});

const handleItemClick = async (item) => {
  switch (item.value) {
    case 'delete': {
      await deleteBook(user.value.id, selectedBook.value.id);
      reloadNuxtApp({ path: '/?toast=book-deleted' });
      break;
    }
    case 'similar': {
      break;
    }
    case 'read': {
      break;
    }
    case 'start': {
      break;
    }
  }
};

const filteredBooks = computed(() => {
  if (tab.value === 'read') {
    return readBooks.value;
  }
  if (tab.value === 'currently-reading') {
    return currentlyReadingBooks.value;
  }
  if (tab.value === 'to-read') {
    return toReadBooks.value;
  }
  return [];
});

const goToBookDetails = (bookId) => {
  navigateTo(`/books/${user.value.id}/${bookId}`);
};

const openQuickActions = (bookId) => {
  selectedBook.value = allBooks.value.find(book => book.id === bookId);
  showQuickActions.value = true;
};

watch(showQuickActions, (newVal) => {
  if (!newVal) {
    setTimeout(() => {
      selectedBook.value = null;
    }, 500);
  }
});

const handleClick = (bookId) => {
  goToBookDetails(bookId);
};

const startHold = (bookId, event) => {
  event.preventDefault();
  holdLength = 0;
  holdTimeout = setInterval(() => {
    holdLength += 100;
  }, 100);
  setTimeout(() => {
    clearInterval(holdTimeout);
    openQuickActions(bookId);
  }, 500);
};

const endHold = (bookId) => {
  if (holdLength < 100) {
    handleClick(bookId);
  }
  if (holdTimeout) {
    clearInterval(holdTimeout);
  }
  holdLength = 0;
  holdTimeout = null;
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

onMounted(async () => {
  let toastMsg = route?.query?.toast;
  if (toastMsg) {
    if (toastMsg === 'book-started') {
      showToast('Book has been started!');
    }
    if (toastMsg === 'book-read') {
      showToast('Book has been marked as read!');
    }
    if (toastMsg === 'book-saved') {
      showToast('Book has been saved!');
    }
    if (toastMsg === 'book-deleted') {
      showToast('Book has been deleted!');
    }
  }
  navigateTo({ path: '/', query: {} });

  try {
    const bookStore = await useBookStore();
    const authStore = await useAuthStore();
    user.value = authStore.getUser();
    allBooks.value = await bookStore.getAllBooks;
    if (!allBooks.value.length) {
      allBooks.value = await bookStore.fetchBooks(user.value.id);
    }
    readBooks.value = bookStore.getReadBooks;
    currentlyReadingBooks.value = bookStore.getCurrentlyReadingBooks;
    toReadBooks.value = bookStore.getWantToReadBooks;
  } catch (error) {
    console.error('An error occurred while fetching user books:', error);
  } finally {
    booksLoading.value = false;
  }
});
</script>
