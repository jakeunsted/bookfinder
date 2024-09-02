<template>
  <v-container class="flex flex-col items-center p-4">
    <div class="w-full max-w-md">
      <!-- Search Bar with Button Inside -->
      <v-text-field
        v-model="searchQuery"
        label="Search for books"
        variant="solo"
        dense
        clearable
        class="mb-4"
        @keyup.enter="searchBooks"
      >
        <template #append-inner>
          <v-btn
            icon
            @click="searchBooks"
            aria-label="Search"
            class="bg-primary"
          >
            <v-icon>mdi-magnify</v-icon>
          </v-btn>
        </template>

        <template v-slot:loader>
          <v-progress-linear
            :active="loading"
            color="primary"
            :model-value="progress"
            height="5"
            indeterminate
          ></v-progress-linear>
        </template>
      </v-text-field>
    </div>
  </v-container>
</template>

<script setup>
import { ref, defineEmits } from 'vue'

const props = defineProps({
  loading: Boolean
})

const searchQuery = ref('')
const emit = defineEmits(['search'])

const searchBooks = () => {
  if (searchQuery.value.trim() !== '') {
    emit('search', searchQuery.value)
  }
}
</script>
