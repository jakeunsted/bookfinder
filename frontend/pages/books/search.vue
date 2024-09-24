<!-- pages/books/recommend/index.vue -->
<template>
  <div class="flex flex-col items-center p-4">
    <BookSearch 
      v-if="!selectedBook && !aiSearch" @search="fetchBooks" 
      :loading="loading"
    />
    <!-- Book results from search -->
    <BookSearchResults
      v-if="!selectedBook && !aiSearch"
      :books="books"
      :loading="loading"
      :hasSearched="hasSearched"
      @select="selectBook"
    />
    <!-- Book results from AI recommendations -->
    <BookSearchResults
      v-if="!selectedBook && aiSearch"
      :books="recommendedBooks"
      :loading="loading"
      :hasSearched="hasSearched"
      @select="selectBook"
    />
    <!-- Book details when clicking into -->
    <BookDetail
      v-if="selectedBook"
      :book="selectedBook"
      :showFullDescription="showFullDescription"
      :aiSearch="aiSearch"
      @clear="clearSelection"
      @toggle-description="toggleDescription"
      @find-similar="fetchRecommendations"
    />

    <v-btn
      v-if="aiSearch && !loading"
      class="bg-primary"
      @click="reset"
    >
      Search new book
    </v-btn>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: 'auth',
  layout: 'search',
});
import BookSearch from '~/components/books/BookSearch.vue';
import BookSearchResults from '~/components/books/BookSearchResults.vue';
import BookDetail from '~/components/books/BookDetails.vue';
import { useMyFetch } from '~/composables/useMyFetch';

const books = ref([]);
const recommendedBooks = ref([]);
const loading = ref(false);
const hasSearched = ref(false);
const selectedBook = ref(null);
const showFullDescription = ref(false);
const aiSearch = ref(false);

// Function to fetch books
const fetchBooks = async (query) => {
  if (query.trim() === '') {
    books.value = [];
    recommendedBooks.value = [];
    return;
  }

  loading.value = true;
  hasSearched.value = true;
  aiSearch.value = false;

  try {
    const response = 
      await useMyFetch(`/books/?title=${encodeURIComponent(query)}`);
    books.value = response;
  } catch (error) {
    console.error('Failed to fetch books:', error);
    books.value = [];
  } finally {
    loading.value = false;
  }
};

const fetchRecommendations = async () => {
  const isbn = selectedBook.value.isbn.isbn13 || selectedBook.value.isbn.isbn10;
  selectedBook.value = null;
  loading.value = true;
  aiSearch.value = true;

  const response = await useMyFetch(`/ai/related-books?isbn=${isbn}`);
  recommendedBooks.value = response.books;
  loading.value = false;
};

// Function to select a book and show details
const selectBook = (book) => {
  selectedBook.value = book;
};

// Function to clear the selected book and go back to search
const clearSelection = () => {
  selectedBook.value = null;
};

// Function to toggle the description view
const toggleDescription = () => {
  showFullDescription.value = !showFullDescription.value;
};

const reset = () =>{
  selectedBook.value = null;
  aiSearch.value = false;
  hasSearched.value = false;
  books.value = [];
  recommendedBooks.value = [];
};
</script>
