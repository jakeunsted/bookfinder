<template>
  <div class="w-full max-w-md text-center" v-if="book && !loading">
    <div class="overflow-hidden">
      <img :src="bookImage" alt="Book Cover" class="h-64 object-cover inline" />
      <div class="p-4">
        <h2 class="text-2xl font-bold">{{ book.title }}</h2>
        <h3 v-if="book.authors && book.authors.length" class="text-lg">
          {{ book.authors.join(', ') }}
        </h3>
        <p class="mt-2">
          {{ truncatedDescription }}
          <span v-if="!showFullDescription" class="primary cursor-pointer underline decoration-wavy" @click="toggleDescription">
            Show More
          </span>
          <span v-if="showFullDescription" class="primary cursor-pointer underline decoration-wavy" @click="toggleDescription">
            Show Less
          </span>
        </p>
        <p class="mt-2"><strong>Page Count:</strong> {{ book.pageCount }}</p>
        <p class="mt-2"><strong>Categories:</strong> {{ book.categories ? book.categories.join(', ') : 'N/A' }}</p>
        <div class="flex justify-center grid">
          <v-btn v-if="!aiSearch" @click="findRecommendations" class="bg-primary my-4">Find Similar</v-btn>
          <v-btn @click="clearSelection" class="bg-primary">Back to Search</v-btn>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: 'auth'
});

// import { ref, watch, onMounted } from 'vue'
// import { useRoute, useRouter } from 'vue-router'
import { htmlToText } from 'html-to-text'

const route = useRoute()
const router = useRouter()

const book = ref(null)
const showFullDescription = ref(false)
const aiSearch = ref(false)
const loading = ref(true)

const defaultImage = '../../assets/default_book.jpg'
const bookImage = ref(defaultImage)
const truncatedDescription = ref('')

const toggleDescription = () => {
  showFullDescription.value = !showFullDescription.value
  updateTruncatedDescription()
}

const clearSelection = () => {
  router.back() // go back to previous page
}

const findRecommendations = () => {
  console.log('not done yet');
}

const fetchBook = async (userId, bookId) => {
  try {
    const response = await useMyFetch(`/users-books/${userId}/${bookId}`)
    book.value = response
  } catch (error) {
    console.error('Failed to fetch book:', error)
  }
}

const updateTruncatedDescription = () => {
  // Get the description (which might contain HTML) from the correct path in the book object
  const description = book.value?.book?.volumeInfo?.description || '';

  // Convert the HTML description to plain text
  const plainTextDescription = htmlToText(description, {
    wordwrap: false,         // Disable word wrapping for cleaner truncation
    preserveNewlines: false, // Remove newlines for smoother truncation
  });

  // If showing the full description, use the plain text directly
  if (showFullDescription.value) {
    truncatedDescription.value = plainTextDescription;
  } else {
    // Truncate if the plain text description exceeds 200 characters
    truncatedDescription.value = plainTextDescription.length > 200 
      ? `${plainTextDescription.slice(0, 200)}...` 
      : plainTextDescription;
  }
};


watch(book, (newBook) => {
  if (newBook) {
    bookImage.value = newBook.book?.volumeInfo?.imageLinks?.thumbnail || defaultImage
    updateTruncatedDescription()
  }
})

onMounted(async () => {
  const bookId = route.params.id
  const userId = route.params.userid
  await fetchBook(userId, bookId)
  loading.value = false
})
</script>