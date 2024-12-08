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

        <!-- Currently Reading Section -->
        <div v-if="!booksLoading">
          <h2 class="text-center mb-4">Currently Reading</h2>
          <div v-if="currentlyReadingBooks.length">
            <masonry-wall
              :items="currentlyReadingBooks"
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
                  @touchstart="(e) => startHold(item.id, e)"
                  @touchmove="checkForScroll"
                  @touchend="(e) => endHold(item.id, e)"
                  @mousedown="(e) => startHold(item.id, e)"
                  @mousemove="checkForScroll"
                  @mouseup="(e) => endHold(item.id, e)"
                  @contextmenu="preventRightClick"
                >
                  <v-card-text class="text-wrap text-center">
                    <div v-if="
                      item.book.bookDetails?.volumeInfo?.
                        imageLinks?.thumbnail || item.image
                    ">
                      <v-img 
                        :src="
                          item.book.bookDetails?.
                            volumeInfo?.imageLinks?.thumbnail || 
                            item.image
                        " 
                        class="pb-2 max-h-50"
                      ></v-img>
                    </div>
                    <div v-else>
                      <v-img 
                        src="@/assets/default_book.jpg" 
                        class="pb-2 max-h-50"
                      />
                    </div>
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
          <div v-else class="flex flex-col items-center">
            <img src="@/assets/images/empty_bookshelf.svg" class="w-1/4 mt-5" />
            <span class="mt-5">You are not reading any books right now.</span>
          </div>
        </div>
        <div v-else>
          <v-progress-circular
            indeterminate color="primary"
          />
        </div>


        <!-- To Read Books Navigation Card -->
        <div class="flex justify-center mt-10">
          <v-card
            class="p-4 hover:cursor-pointer hover:bg-gray-100"
            rounded="xl"
            elevation="10"
            @click="navigateToToReadBooks"
          >
            <v-card-text class="text-center">
              <h2>View To Read Books</h2>
            </v-card-text>
          </v-card>
        </div>

        <!-- Read Books Navigation Card -->
        <div class="flex justify-center mt-10">
          <v-card
            class="p-4 hover:cursor-pointer hover:bg-gray-100"
            rounded="xl"
            elevation="10"
            @click="navigateToReadBooks"
          >
            <v-card-text class="text-center">
              <h2>View Read Books</h2>
            </v-card-text>
          </v-card>
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

const { deleteBook, markAsRead, startReading } = useBookFunctions();

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

const quickItems = ref([
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
  {
    title: 'Delete book from library',
    value: 'delete',
    icon: 'mdi-trash-can-outline',
  },
]);

const handleItemClick = async (item) => {
  switch (item.value) {
    case 'delete': {
      await deleteBook(user.value.id, selectedBook.value.id);
      reloadNuxtApp({ path: '/?toast=book-deleted' });
      break;
    }
    case 'similar': {
      window.alert('Similar books not implemented yet');
      break;
    }
    case 'read': { 
      await markAsRead(user.value.id, selectedBook.value.id);
      reloadNuxtApp({ path: '/?toast=book-read' });
      break;
    }
    case 'start': {
      await startReading(user.value.id, selectedBook.value.id);
      reloadNuxtApp({ path: '/?toast=book-started' });
      break;
    }
  }
};

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

let holdTimeout = null;
let holdLength = 0;
let startX = 0;
let startY = 0;
let isDragging = false;
const moveThreshold = 10;
const verticalDragThreshold = 10;

const startHold = (bookId, event) => {
  const touch = event.touches?.[0] || event;
  startX = touch.clientX;
  startY = touch.clientY;
  isDragging = false;
  holdLength = 0;
  holdTimeout = setInterval(() => {
    holdLength += 100;
  }, 100);
  setTimeout(() => {
    if (!isDragging && holdLength >= 500) {
      clearInterval(holdTimeout);
      openQuickActions(bookId);
    }
  }, 500);
};

const checkForScroll = (event) => {
  const touch = event.touches?.[0] || event;
  const deltaX = Math.abs(touch.clientX - startX);
  const deltaY = Math.abs(touch.clientY - startY);

  if (deltaY > verticalDragThreshold) {
    isDragging = true;
    if (holdTimeout) {
      clearInterval(holdTimeout);
    }
    holdLength = 0;
    holdTimeout = null;
  } else if (deltaX > moveThreshold) {
    isDragging = true;
    if (holdTimeout) {
      clearInterval(holdTimeout);
    }
    holdLength = 0;
    holdTimeout = null;
  }
};

const endHold = (bookId) => {
  if (isDragging) {
    return;
  }
  if (holdLength < 500) {
    handleClick(bookId);
  }
  if (holdTimeout) {
    clearInterval(holdTimeout);
  }
  holdLength = 0;
  holdTimeout = null;
};

const preventRightClick = (event) => {
  event.preventDefault();
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

const navigateToReadBooks = () => {
  navigateTo('/books/read');
};

const navigateToToReadBooks = () => {
  navigateTo('/books/to-read');
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
