<template>
  <div class="w-full p-4">
    <h1 class="text-xl">Date Started</h1>
    <!-- If not started maybe show start now and started  -->
    <v-card :flat="true" color="grey5" rounded="xl" class="text-left">
      <v-card-text>
        <p v-if="book.dateStarted">{{ formattedStartDate }}</p>
        <p v-else>Book not started</p>
      </v-card-text>
    </v-card>

    <h1 class="text-xl">Date Finished</h1>
    <!-- Maybe add button to finish now and set date -->
    <v-card :flat="true" color="grey5" rounded="xl" class="text-left">
      <v-card-text>
        <p v-if="book.dateFinished">{{ formattedEndDate }}</p>
        <p v-else>Book not finished</p>
      </v-card-text>
    </v-card>

    <h1 class="text-xl">User Rating</h1>
    <v-card :flat="true" color="grey5" rounded="xl" class="text-left">
      <v-card-text>
        <v-rating
          :model-value="book.userRating / 2"
          @update:model-value="book.userRating = $event * 2"
          color="primary"
          active-color="primary"
          hover
          half-increments
          length="5"
        ></v-rating>
      </v-card-text>
    </v-card>

    <h1 class="text-xl">User Review</h1>
    <v-card 
      :flat="true"
      color="grey5"
      rounded="xl"
      class="text-left"
      @click="editingReview = true"
    >
      <v-card-text v-if="!editingReview">
        <p v-if="book.userNotes">{{ book.userNotes }}</p>
        <p v-else>No notes written</p>
      </v-card-text>
      <template v-slot:text v-if="editingReview">
        <v-textarea
          label="Write a review"
          variant="outlined"
          v-model="book.userNotes"
          append-inner-icon="mdi-content-save"
          @click:append-inner="saveChanges"
        />
      </template>
    </v-card>
  </div>
</template>

<script setup>
const route = useRoute();

const props = defineProps({
  book: {
    type: Object,
    required: true,
  },
});
const { book } = toRefs(props);
const editingReview = ref(false);

const formattedStartDate = computed(() => {
  if (book.value.dateStarted) {
    const date = new Date(book.value.dateStarted);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
    });
  }
  return '';
});

const formattedEndDate = computed(() => {
  if (book.value.dateFinished) {
    const date = new Date(book.value.dateFinished);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
    });
  }
  return '';
});

watch(() => book.value.userRating, (newRating, oldRating) => {
  if (newRating !== oldRating) {
    book.value.userRating = newRating;
    saveChanges();
  }
});

const saveChanges = async () => {
  console.log('saving review');
  const updatedBook = await useMyFetch(
    `/users-books/${route.params.userid}/${route.params.id}`, {
      method: 'PATCH',
      body: {
        dateStarted: book?.value?.dateStarted,
        dateFinished: book?.value?.dateFinished,
        userNotes: book?.value?.userNotes,
        userRating: book?.value?.userRating,
      },
    },
  );
  if (!updatedBook) {
    console.error('failed to update book');
  }
  console.log('updated book:', updatedBook);
  book.value = updatedBook;
  editingReview.value = false;
};

const markAsStarted = () => {
  // Dialog to set when started
  //    Now or past
};

const markAsFinished = () => {
  // Dialog to set when finished
  //    Now or past
  //    Collect a rating
  //    allow for a review text entry
  // Update via API
};

</script>