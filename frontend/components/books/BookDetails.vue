<template>
  <div class="w-full text-center p-4" v-if="bookDetails && !loading">
    <!-- Image section with title, author, and page count -->
    <div class="flex mb-5">
      <v-card class="max-w-36" rounded="xl" elevation="10" border="xl">
        <img :src="bookImage" alt="Book Cover" class="object-cover inline" />
      </v-card>
      <div>
        <v-card :flat="true" color="transparent" class="text-left">
          <v-card-item>
            <v-card-title class="text-wrap pb-2">
              {{ bookDetails.volumeInfo.title || 'No Title Available' }}
            </v-card-title>
            <v-card-text class="p-0">
              {{ primaryAuthor }}
            </v-card-text>
            <v-card-text class="p-0">
              {{ pageCount }}
            </v-card-text>
          </v-card-item>
        </v-card>
      </div>
    </div>

    <!-- Categories -->
    <h1 class="text-left text-xl">Categories</h1>
    <div class="flex flex-wrap">
      <v-chip
        v-for="category in categories"
        :key="category"
        class="m-1"
        color="primary"
        rounded="xl"
        label
      >
        {{ category }}
      </v-chip>
    </div>

    <!-- Description -->
    <h1 class="text-left text-xl">Description</h1>
    <v-card :flat="true" color="transparent" class="text-left">
      <v-card-text>
        <p v-if="truncatedDescription">
          {{ truncatedDescription }}
          <span
            v-if="hasLongDescription"
            @click="toggleDescription"
            class="text-blue-500 cursor-pointer"
          >
            {{ showFullDescription ? 'show less' : 'show more' }}
          </span>
        </p>
        <p v-else>No description available</p>
      </v-card-text>
    </v-card>

    <slot name="content"></slot>
  </div>
</template>

<script setup>
import { htmlToText } from 'html-to-text';

/**
 * @prop {Object} bookDetails - The book details object from google api
 * @prop {String} defaultImage
 * @prop {Boolean} loading
 */
const props = defineProps({
  bookDetails: {
    type: Object,
    required: true,
  },
  defaultImage: {
    type: String,
    default: '/assets/default_book.jpg',
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

const { bookDetails, defaultImage, loading } = toRefs(props);

const showFullDescription = ref(false);
const bookImage = ref('');
const categories = ref([]);
const truncatedDescription = ref('');
const plainTextDescription = ref('');
const hasLongDescription = ref(false);

const primaryAuthor = computed(() => {
  const authors = bookDetails.value.volumeInfo.authors;
  return authors && authors.length > 0 ? authors[0] : 'Unknown Author';
});

const pageCount = computed(() => {
  const count = bookDetails.value.volumeInfo.pageCount;
  return count ? `${count} Pages` : 'Page Count Not Available';
});

const toggleDescription = () => {
  showFullDescription.value = !showFullDescription.value;
  updateTruncatedDescription();
};

const updateTruncatedDescription = () => {
  const description = bookDetails.value.volumeInfo?.description || '';

  plainTextDescription.value = htmlToText(description, {
    wordwrap: false,
    preserveNewlines: false,
  });

  hasLongDescription.value = plainTextDescription.value.length > 200;

  truncatedDescription.value = showFullDescription.value
    ? plainTextDescription.value
    : hasLongDescription.value
      ? `${plainTextDescription.value.slice(0, 200)}...`
      : plainTextDescription.value;
};

const generateCategories = () => {
  const uniqueCategories = new Set();

  (bookDetails.value.volumeInfo.categories || []).forEach((categoryString) => {
    const splitCategories = categoryString.split('/').map((cat) => cat.trim());
    splitCategories.forEach((cat) => uniqueCategories.add(cat));
  });

  categories.value = Array.from(uniqueCategories).slice(0, 5);
};

onMounted(() => {
  bookImage.value =
    bookDetails.value.volumeInfo?.imageLinks?.thumbnail || defaultImage;
  generateCategories();
  updateTruncatedDescription();
});
</script>
