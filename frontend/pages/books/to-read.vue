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
      <div v-if="!booksLoading">
        <h2 class="text-center mb-4">To Read Pile</h2>
        <div v-if="toReadBooks.length">
          <masonry-wall
            :items="toReadBooks"
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
          <span class="mt-5">
            You have not added any books to your library yet.
          </span>
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

const bookStore = useBookStore();
const authStore = useAuthStore();
const booksLoading = ref(true);
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
    title: 'Start reading',
    value: 'start',
    icon: 'mdi-book-open-page-variant',
  },
  {
    title: 'Delete book from library',
    value: 'delete',
    icon: 'mdi-trash-can-outline',
  },
]);

const openQuickActions = (bookId) => {
  selectedBook.value = toReadBooks.value.find(book => book.id === bookId);
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

const goToBookDetails = (bookId) => {
  navigateTo(`/books/${user.value.id}/${bookId}`);
};

const snackbar = ref(false);
const snackbarMessage = ref('');
const snackbarColor = ref('success');
const snackbarTimeout = ref(3000);

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
  navigateTo({ path: '/books/to-read', query: {} });

  try {
    toReadBooks.value = bookStore.getWantToReadBooks;
    user.value = authStore.getUser();
  } catch (error) {
    console.error('An error occurred while fetching to-read books:', error);
  } finally {
    booksLoading.value = false;
  }
});
</script>
