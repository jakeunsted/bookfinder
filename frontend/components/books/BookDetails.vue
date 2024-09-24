<template>
  <div class="w-full max-w-md text-center">
    <div class="bg-zinc-900 shadow-lg rounded-lg overflow-hidden">
      <img :src="bookImage" alt="Book Cover" class="h-64 object-cover inline" />
      <div class="p-4">
        <h2 class="text-2xl font-bold text-white">{{ book.title }}</h2>
        <h3 
          v-if="book.authors && book.authors.length" 
          class="text-lg text-gray-300"
        >
          {{ book.authors.join(', ') }}
        </h3>
        <p class="mt-2">
          {{ truncatedDescription }}
          <span 
            v-if="!showFullDescription"
            class="text-blue-500 cursor-pointer underline decoration-wavy"
            @click="toggleDescription"
          >
            Show More
          </span>
          <span 
            v-if="showFullDescription"
            class="text-blue-500 cursor-pointer underline decoration-wavy"
            @click="toggleDescription"
          >
            Show Less
          </span>
        </p>
        <p class="mt-2 text-white">
          <strong>Page Count:</strong> 
          {{ book.pageCount }}
        </p>
        <p class="mt-2 text-white">
          <strong>Categories:</strong> 
          {{ book.categories ? book.categories.join(', ') : 'N/A' }}
        </p>
        <div class="flex justify-center grid">
          <v-btn
            v-if="!aiSearch"
            @click="findRecommendations"
            class="bg-primary my-4"
          >
            Find Similar
          </v-btn>
          <v-btn
            @click="clearSelection" 
            class="bg-primary"
          >
            Back to Search
          </v-btn>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, defineProps, defineEmits } from 'vue';

const props = defineProps({
  book: Object,
  showFullDescription: Boolean,
  aiSearch: Boolean,
});

const emit = defineEmits(['clear']);

const defaultImage = '../../assets/default_book.jpg';
const bookImage = computed(() => {
  return props.book.image ? props.book.image : defaultImage;
});

const truncatedDescription = computed(() => {
  if (
    props.showFullDescription || !props.book
  ) return props.book.description || '';
  const description = props.book.description || '';
  return description.length > 200 ?
    `${description.slice(0, 200)}...` : description;
});

const toggleDescription = () => {
  emit('toggle-description');
};

const clearSelection = () => {
  emit('clear');
};

const findRecommendations = () => {
  emit('findSimilar', props.book);
};
</script>
