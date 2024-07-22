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
              <div class="flex">
                <!-- Book Cover Image -->
                <v-list-item-avatar class="min-w-20">
                  <img
                    v-if="book.image"
                    :src="book.image"
                    alt="Book Cover"
                    class="max-h-24"
                  />
                  <img
                    v-else
                    src="/default_book.jpg"
                    alt="Default Book Cover"
                    class="w-full h-full"
                  />
                </v-list-item-avatar>
                
                <!-- Book Details -->
                <v-list-item-content>
                  <v-card class="w-full flex">
                    <v-card-title class="text-lg font-semibold text-wrap">
                      {{ book.title }}
                    </v-card-title>
                    <v-card-subtitle v-if="book.authors && book.authors.length" class="text-sm">
                      {{ book.authors[0] }}
                    </v-card-subtitle>
                  </v-card>
                </v-list-item-content>
              </div>
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
