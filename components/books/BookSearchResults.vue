<template>
  <v-container class="w-full max-w-md">
    <div v-if="hasSearched">
      <div v-if="loading" class="text-center">
        <v-progress-linear indeterminate color="primary" />
      </div>
      <div v-else>
        <div v-if="hasSearched && books.length === 0" class="text-center">
          No results found
        </div>
        <v-list v-else>
          <v-list-item-group>
            <v-list-item
              v-for="book in books"
              :key="book.title"
              class="mb-2"
              @click="selectBook(book)"
            >
              <v-card>
                <v-card-title>{{ book.title }}</v-card-title>
                <v-card-subtitle v-if="book.authors && book.authors.length">{{ book.authors[0] }}</v-card-subtitle>
              </v-card>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </div>
    </div>
  </v-container>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  books: Array,
  loading: Boolean,
  hasSearched: Boolean
})

const emit = defineEmits(['select'])

const selectBook = (book) => {
  emit('select', book)
}
</script>
