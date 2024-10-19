<template>
  <div class="w-full p-4">
    <v-snackbar
      v-model="snackbar"
      color="success"
      timeout="3000"
      location="top"
    >
      Book updated successfully!
      <template #action="{ attrs }">
        <v-btn text v-bind="attrs" @click="snackbar = false">Close</v-btn>
      </template>
    </v-snackbar>

    <DateField
      :date="book.dateStarted"
      label="Date Started"
      false-message="Book not started" 
      class="pb-2"
      @update-date="handleDateUpdate('dateStarted', $event)"
    />

    <DateField
      :date="book.dateFinished"
      label="Date Finished"
      false-message="Book not finished" 
      class="pb-2"
      @update-date="handleDateUpdate('dateFinished', $event)"
    />

    <h1 class="text-xl">User Rating</h1>
    <v-card 
      :flat="true"
      color="grey5"
      rounded="xl" 
      class="text-left"
    >
      <v-card-text class="p-0">
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

import DateField from '@/components/fields/DateField.vue';

const props = defineProps({
  book: {
    type: Object,
    required: true,
  },
});
const { book } = toRefs(props);
const editingReview = ref(false);
const snackbar = ref(false);

watch(() => book.value.userRating, (newRating, oldRating) => {
  if (newRating !== oldRating) {
    book.value.userRating = newRating;
    saveChanges();
  }
});

const handleDateUpdate = (field, newDate) => {
  book.value[field] = newDate;
  saveChanges();
};

const saveChanges = async () => {
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
  } else {
    snackbar.value = true;
  }
  book.value = updatedBook;
  editingReview.value = false;
};

</script>