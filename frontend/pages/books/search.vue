<template>
  <div>
    <closeBar @closeBarClicked="handleCloseBarClick" />
    <div class="h-full bg-window">
      <div class="h-full flex flex-col items-center p-4">
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
              <v-btn 
                @click="fetchRecommendations" 
                class="mt-4" 
                color="secondary"
              >
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
      <MenuBar 
        v-if="selectedBook"
        :centerIcon="'mdi-play'"
        :leftIcon="'mdi-content-save'"
        :rightIcon="'mdi-creation'"
        @left-click="saveBook"
        @right-click="fetchRecommendations"
        :menuItems="startItems"
        @menu-item-click="handleStartItemClick"
      />
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: 'auth',
});

import CloseBar from '@/components/navigation/closeBar.vue';
import MenuBar from '@/components/navigation/menuBar.vue';
import BookSearch from '~/components/books/BookSearch.vue';
import BookSearchResults from '~/components/books/BookSearchResults.vue';
import BookDetails from '~/components/books/BookDetails.vue'; 
import { useMyFetch } from '~/composables/useMyFetch';

const authStore = useAuthStore();
const bookStore = useBookStore();

const books = ref([]);
const recommendedBooks = ref([]);
const loading = ref(false);
const hasSearched = ref(false);
const selectedBook = ref(null);
const selectedBookDetails = ref(null);
const aiSearch = ref(false);
const user = await authStore.getUser();
const defaultImage = '/assets/default_book.jpg';

// Menu Bar Items
const startItems = [
  {
    title: 'Start book now',
    value: 'start',
    icon: 'mdi-bookmark-plus',
  },
  {
    title: 'Already read',
    value: 'read',
    icon: 'mdi-book-check-outline',
  },
];

const handleStartItemClick = (item) => {
  if (item.value === 'start') {
    startBook();
  } else if (item.value === 'read') {
    // markAsRead();
    window.alert('Completed read not implemented yet');
  }
};

/**
 * Save book to user as started reading
 */
const startBook = async () => {
  const book = selectedBook.value;
  if (!book) return;
  try {
    const body = {
      title: book.title,
      isbn: book?.isbn?.isbn13 || book?.isbn?.isbn10,
      tags: book.categories,
      createdById: user.id,
      quickLink: book.quickLink,
    };
    const addBookToDb = await useMyFetch('/books', {
      method: 'post',
      body: body,
    });
    if (!addBookToDb) {
      console.error('Failed to add book to database');
      return;
    }
    const addBookToUser = await useMyFetch(
      `/users-books/${user.id}/${addBookToDb.id}`, {
        method: 'post',
        body: {
          dateStarted: new Date(),
        },
      },
    );
    if (!addBookToUser) {
      console.error('Failed to add book to user');
      return;
    }

    // reload bookStore
    await bookStore.fetchBooks(user.id);

    // Go back to home page with query param
    navigateTo({ path: '/', query: { toast: 'book-started' } });
  } catch (error) {
    console.error('Failed to start book:', error);
  }
};

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
};

// Function to clear the selected book and go back to search
const clearSelection = () => {
  selectedBook.value = null;
  selectedBookDetails.value = null;
};

const handleCloseBarClick = () => {
  if (selectedBook.value) {
    clearSelection();
  } else {
    navigateTo('/');
  }
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
