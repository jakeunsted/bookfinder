<template>
  <v-container class="w-full max-w-md">
    <div v-if="hasSearched">
      <div v-if="!loading">
        <div v-if="books.length === 0" class="text-center">
          No results found
        </div>
        <div v-else>
          <v-row dense>
            <v-col v-for="book in books" :key="book.id || book.title" cols="12">
              <v-card
                @click="selectBook(book)"
                class="d-flex align-center cursor-pointer"
              >
                <img
                  :src="book.image || defaultImage"
                  alt="Book Cover"
                  class="h-16 pl-4"
                />
                <v-card-text class="flex-grow-1">
                  <div class="text-lg font-semibold">
                    {{ book.title }}
                  </div>
                  <div 
                    v-if="book.authors && book.authors.length"
                    class="text-sm"
                  >
                    {{ book.authors[0] }}
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </div>
      </div>
    </div>
  </v-container>
</template>

<script setup>
const props = defineProps({
  books: {
    type: Array,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  hasSearched: {
    type: Boolean,
    default: false,
  },
  defaultImage: {
    type: String,
    default: '/assets/default_book.jpg',
  },
});
const { books, loading, hasSearched, defaultImage } = toRefs(props);

const emit = defineEmits(['select']);

const selectBook = (book) => {
  emit('select', book);
};
</script>
