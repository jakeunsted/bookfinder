<template>
  <v-container class="flex flex-col items-center p-4">
    <BookSearch @search="fetchBooks" />
    <BookList
      :books="books"
      :loading="loading"
      :hasSearched="hasSearched"
      @select="logBook"
    />
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import BookSearch from '~/components/books/BookSearch.vue'
import BookList from '~/components/books/BookSearchResults.vue'
import { useMyFetch } from '~/composables/useMyFetch'

const searchQuery = ref('')
const books = ref([])
const loading = ref(false)
const hasSearched = ref(false)

// Function to fetch books
const fetchBooks = async (query) => {
  if (query.trim() === '') {
    books.value = []
    return
  }

  loading.value = true
  hasSearched.value = true

  try {
    const response = await useMyFetch(`/books/?title=${encodeURIComponent(query)}`)
    books.value = response
  } catch (error) {
    console.error('Failed to fetch books:', error)
    books.value = []
  } finally {
    loading.value = false
  }
}

// Function to log the book object when an item is clicked
const logBook = (book) => {
  console.log('Selected book:', book)
}
</script>
