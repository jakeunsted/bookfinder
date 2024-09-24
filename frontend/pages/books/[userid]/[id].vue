<template>
  <div v-if="!loading">
    <BookDetails
      :bookDetails="bookDetails"
      :defaultImage="defaultImage"
      :loading="loading"
    />
  </div>
</template>

<script setup>
definePageMeta({
  middleware: 'auth',
  layout: 'book',
});

import { useBookStore } from '@/stores/useBookStore';
import BookDetails from '@/components/books/BookDetails.vue';

const route = useRoute();
const bookStore = useBookStore();

const book = ref(null);
const bookDetails = ref({});
const loading = ref(true);

const defaultImage = '/assets/default_book.jpg';

const fetchBook = async (userId, bookId) => {
  const bookFromStore = bookStore.getBookById(bookId);
  if (bookFromStore) {
    book.value = bookFromStore;
  } else {
    try {
      const response = await useMyFetch(`/users-books/${userId}/${bookId}`);
      book.value = response;
    } catch (error) {
      console.error('Failed to fetch book:', error);
    }
  }
};

onMounted(async () => {
  const bookId = route.params.id;
  const userId = route.params.userid;
  await fetchBook(userId, bookId);
  if (book.value) {
    bookDetails.value = book.value?.book?.bookDetails;
    console.log('Book Details:', bookDetails.value);
  }
  loading.value = false;
});
</script>
