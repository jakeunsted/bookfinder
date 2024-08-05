<template>
<div class="relative h-24">
  <div class="absolute left-1/2 -translate-x-1/2 bottom-0 mb-15 z-10">
    <div class="flex items-center justify-center rounded-full w-16 h-16 bg-gray-600">
      <v-btn @click="onPlusClick" variant="text" class="rounded-circle h-16">
        <v-icon class="text-white text-4xl">mdi-plus</v-icon>
      </v-btn>
    </div>
  </div>
  <div class="absolute bottom-0 w-5/6 mb-8 left-1/2 -translate-x-1/2 flex justify-between items-center rounded-full py-2 px-8 bg-gray-400 z-0">
    <v-btn @click="onHomeClick" :ripple="false" variant="text" class="text-white text-2xl" icon="mdi-home" />
    <v-btn @click="onCreationClick" :ripple="false" variant="text" class="text-white text-2xl" icon="mdi-creation" />
  </div>
</div>
</template>

<script setup>
import { ref } from 'vue';

const onPlusClick = () => {
  console.log('Plus button clicked');
};

const onHomeClick = () => {
  console.log('Home button clicked');
};

const onCreationClick = () => {
  console.log('Creation button clicked');
};
</script>