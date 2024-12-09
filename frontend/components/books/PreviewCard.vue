<template>
  <div class="flex justify-center mt-10">
    <v-card
      class="p-4 hover:cursor-pointer hover:bg-gray-100"
      rounded="xl"
      elevation="10"
      @click="cardClick"
    >
      <v-card-text class="text-center">
        <h2>{{ title }}</h2>
        <div class="flex justify-center mt-4">
          <img
            v-for="(image, index) in bookImages"
            :key="index"
            :src="image"
            alt="Book Image"
            :class="getImageClass(index)"
          />
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  books: {
    type: Array,
    required: false,
  },  
});

const { title, books } = toRefs(props);

// get images of first 5 books
const bookImages = books.value.slice(0, 5)
  .map((book) => book.book.bookDetails?.volumeInfo?.imageLinks?.thumbnail);

const getImageClass = (index) => {
  switch (index) {
    case 0:
    case 4:
      return 'image-smallest drop-shadow-xl z-0';
    case 1:
    case 3:
      return 'image-smaller drop-shadow-xl z-10';
    case 2:
      return 'image-largest drop-shadow-xl z-20';
    default:
      return '';
  }
};

const emit = defineEmits(['card-click']);

const cardClick = () => {
  emit('card-click');
};
</script>

<style scoped>
@media (max-width: 400px) {
  .image-smallest {
    display: none;
  }
}

.image-smallest {
  height: 80px;
  margin: 0 -5px
}

.image-smaller {
  height: 90px;
  margin: 0 -5px;
}

.image-largest {
  height: 100px;
}
</style>
