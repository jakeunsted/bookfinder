<template>
  <div class="w-full text-center p-4" v-if="book && !loading">
    <!-- Image section with title, author and page count -->
    <div class="flex mb-5">
      <v-card
        class="max-w-36"
        rounded="xl"
        elevation="10"
        border="xl"
      >
        <img :src="bookImage" alt="Book Cover" class="object-cover inline" />
      </v-card>
      <div>
        <v-card flat=true color="transparent" class="text-left">
          <v-card-item>
            <v-card-title class="text-wrap pb-2">
              {{ bookDetails.title }}
            </v-card-title>
            <v-card-text class="p-0">
              {{ bookDetails.volumeInfo.authors[0] }}
            </v-card-text>
            <v-card-text class="p-0">
              {{ bookDetails.volumeInfo.pageCount }} Pages
            </v-card-text>
          </v-card-item>
        </v-card>
      </div>
    </div>

    <!-- Categories -->
    <h1 class="text-left text-xl">Categories</h1>
    <div 
      class="flex flex-wrap"
    >
      <v-chip
        v-for="category in categories"
        :key="category"
        class="m-1"
        color="primary"
        rounded="xl"
        label
      >
        {{ category }}
      </v-chip>
    </div>

    <!-- Description -->
    <h1 class="text-left text-xl">Description</h1>
    <v-card flat="true" color="transparent" class="text-left">
      <v-card-text>
        <p v-if="truncatedDescription">
          {{ truncatedDescription }}
          <span
            v-if="truncatedDescription.length > 200"
            @click="toggleDescription" class="text-blue-500 cursor-pointer"
          >
            {{ showFullDescription ? 'show less' : 'show more' }}
          </span>
        </p>
        <p v-else>No description available</p>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: 'auth',
  layout: 'book',
});

import { htmlToText } from 'html-to-text';
import { useBookStore } from '@/stores/useBookStore';

const route = useRoute();
const bookStore = useBookStore();

const book = ref(null);
const bookDetails = ref(null);
const categories = ref([]);
const showFullDescription = ref(false);
// const aiSearch = ref(false);
const loading = ref(true);

const defaultImage = '../../assets/default_book.jpg';
const bookImage = ref(defaultImage);
const truncatedDescription = ref('');

const toggleDescription = () => {
  showFullDescription.value = !showFullDescription.value;
  updateTruncatedDescription();
};

// const findRecommendations = () => {
//   console.log('not done yet');
// };

const fetchBook = async (userId, bookId) => {
  const bookFromStore = bookStore.getBookById(bookId);
  console.log('bookFromStore:', bookFromStore);
  if (bookFromStore) {
    book.value = bookFromStore;
    return;
  } else {
    try {
      const response = await useMyFetch(`/users-books/${userId}/${bookId}`);
      book.value = response;
    } catch (error) {
      console.error('Failed to fetch book:', error);
    }
  }
};

const updateTruncatedDescription = () => {
  const description = bookDetails.value?.volumeInfo?.description || '';

  const plainTextDescription = htmlToText(description, {
    wordwrap: false,
    preserveNewlines: false,
  });

  // If showing the full description, use the plain text directly
  if (showFullDescription.value) {
    truncatedDescription.value = plainTextDescription;
  } else {
    // Truncate if the plain text description exceeds 200 characters
    truncatedDescription.value = plainTextDescription.length > 200 
      ? `${plainTextDescription.slice(0, 200)}...` 
      : plainTextDescription;
  }
};

const generateCategories = () => {
  const uniqueCategories = new Set();

  bookDetails.value.volumeInfo.categories.forEach(categoryString => {
    const splitCategories = categoryString.split('/').map(cat => cat.trim());
    splitCategories.forEach(cat => uniqueCategories.add(cat));
  });

  categories.value = Array.from(uniqueCategories).slice(0, 5);
  console.log('categories:', categories.value);
};


watch(book, (newBook) => {
  if (newBook) {
    bookImage.value = 
      newBook.book?.bookDetails?.volumeInfo?.imageLinks?.thumbnail 
      || defaultImage;
    bookDetails.value = newBook.book.bookDetails;
    updateTruncatedDescription();
    generateCategories();
  }
});

onMounted(async () => {
  const bookId = route.params.id;
  const userId = route.params.userid;
  await fetchBook(userId, bookId);
  console.log('book:', book.value);
  loading.value = false;
});
</script>