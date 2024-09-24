<template>
  <div class="flex flex-col items-center p-4">
    <!-- Search Bar -->
    <BookSearch
      v-if="!selectedBook && !aiSearch"
      @search="fetchBooks"
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
    <div v-if="selectedBook">
      <BookDetails
        :bookDetails="selectedBookDetails"
        :defaultImage="defaultImage"
        :loading="loading"
      >
        <template #additional-info>
          <!-- Buttons specific to this page -->
          <v-btn @click="clearSelection" class="mt-4" color="primary">
            Back to Search
          </v-btn>
          <v-btn @click="fetchRecommendations" class="mt-4" color="secondary">
            Find Similar Books
          </v-btn>
        </template>
      </BookDetails>
    </div>

    <!-- Reset button when AI search is active -->
    <v-btn v-if="aiSearch && !loading" class="bg-primary" @click="reset">
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
import BookDetails from '~/components/books/BookDetails.vue'; 
import { useMyFetch } from '~/composables/useMyFetch';

const books = ref([]);
const recommendedBooks = ref([]);
const loading = ref(false);
const hasSearched = ref(false);
const selectedBook = ref(null);
const selectedBookDetails = ref(null);
const aiSearch = ref(false);
const defaultImage = '/assets/default_book.jpg';

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

// Function to fetch AI recommendations
const fetchRecommendations = async () => {
  const isbn = 
    selectedBook.value.isbn?.isbn13 || 
    selectedBook.value.isbn?.isbn10;
  selectedBook.value = null;
  selectedBookDetails.value = null;
  loading.value = true;
  aiSearch.value = true;

  try {
    const response = await useMyFetch(`/ai/related-books?isbn=${isbn}`);
    recommendedBooks.value = response.books;
  } catch (error) {
    console.error('Failed to fetch recommendations:', error);
    recommendedBooks.value = [];
  } finally {
    loading.value = false;
  }
};

// Function to select a book and show details
const selectBook = (book) => {
  selectedBook.value = book;
  transformBookDetails(book);
};

// Function to transform book data to match BookDetails component structure
const transformBookDetails = (book) => {
  console.log('transform pre book', book);
  selectedBookDetails.value = {
    volumeInfo: {
      title: book.title || 'No Title Available',
      authors: book.authors || ['Unknown Author'],
      description: book.description || 'No description available',
      imageLinks: {
        thumbnail: book.image || defaultImage,
      },
      pageCount: book.pageCount || 'Page Count Not Available',
      categories: book.categories || [],
    },
  };
  console.log(selectedBookDetails.value);
};

// Function to clear the selected book and go back to search
const clearSelection = () => {
  selectedBook.value = null;
  selectedBookDetails.value = null;
};

// Function to reset the search
const reset = () => {
  selectedBook.value = null;
  selectedBookDetails.value = null;
  aiSearch.value = false;
  hasSearched.value = false;
  books.value = [];
  recommendedBooks.value = [];
};
</script>
