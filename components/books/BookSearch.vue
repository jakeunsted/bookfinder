<template>
  <v-container class="flex flex-col items-center p-4">
    <div class="w-full max-w-md">
      <!-- Search Bar with Button Inside -->
      <v-text-field
        v-model="searchQuery"
        label="Search for books"
        outlined
        dense
        class="mb-4"
        @keyup.enter="searchBooks"
      >
        <template #append>
          <v-btn
            icon
            @click="searchBooks"
            aria-label="Search"
          >
            <v-icon>mdi-magnify</v-icon>
          </v-btn>
        </template>
      </v-text-field>
    </div>
  </v-container>
</template>

<script setup>
import { ref, defineEmits } from 'vue'

const searchQuery = ref('')
const emit = defineEmits(['search'])

const searchBooks = () => {
  if (searchQuery.value.trim() !== '') {
    emit('search', searchQuery.value)
  }
}
</script>
